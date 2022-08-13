//Variables  
const path = require('path')
const express = require('express')
const dotenv = require('dotenv')
const passport = require('passport')
const session = require('express-session')  //Requiring session
//logs which pages are being touched in console
const morgan = require('morgan')
//require override package so that we can use PUT and DELETE
const methodOverride= require('method-override')
//set up handlebars
const exphbs = require('express-handlebars')
//Need to store session data in db
const MongoStore = require('connect-mongo')
//Connection to db requires url from config db file
const connectDB = require('./config/db')
const { default: mongoose } = require('mongoose')

//Load config file
dotenv.config({path: './config/config.env'})

//Passport config
require('./config/passport')(passport)
//Tells app to connect
connectDB()

const app = express()
//Body parser
app.use(express.urlencoded({ extended: false}))
app.use(express.json())

//Method override middleware
app.use(methodOverride(function (req,res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body){
        //look in urlencoded POST bodies and delete it
        let method = req.body._method  //extract method and store it
        delete req.body._method        //delete from req
        return method                  //now available elsewhere 
    }
}))


//only run morgan in development mode: Logging
if(process.env.NODE_ENV == 'development'){
    app.use(morgan('dev'))
}

//Handlebars Helpers
const {formatDate, stripTags, truncate, editIcon, select} = require('./helpers/hbs')

//Middleware to handle Handlebars
app.engine(
    '.hbs',
    exphbs.engine ({
        helpers:{
            formatDate,
            stripTags,
            truncate,
            editIcon,
            select,
        },
    defaultLayout: 'main', 
    extname: '.hbs'
})
);
app.set('view engine', '.hbs')

//Session middleware. Must go above passport middleware
app.use(
  session ({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    //store cookies in db
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI
    })
}))


//Passport middleware
app.use(passport.initialize())
app.use(passport.session())

//Set global variable to allow index.hbs to use the logged in user and not just the storyUser
app.use(function (req,res,next){ //Next: pass the request onto the next middleware. Similar to .then
     res.locals.user = req.user || null
     next()
})


//app.use(express.static('public')) works fine without path
app.use(express.static(path.join(__dirname, 'public')))

//Tells app to use routes
app.use('/', require('./routes/index'))
//app.use('/dashboard', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
//the route for adding story
app.use('/stories', require('./routes/stories'))

const PORT = process.env.PORT || 3000 

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on ${PORT}`))
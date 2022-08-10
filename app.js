//Variables  
const path = require('path')
const express = require('express')
const dotenv = require('dotenv')
const passport = require('passport')
const session = require('express-session')  //Requiring session
//logs which pages are being touched in console
const morgan = require('morgan')
//set up handlebars
const exphbs = require('express-handlebars')
//Connection to db requires url from config db file
const connectDB = require('./config/db')

//Load config file
dotenv.config({path: './config/config.env'})

//Passport config
require('./config/passport')(passport)
//Tells app to connect
connectDB()

const app = express()
//only run morgan in development mode
if(process.env.NODE_ENV == 'development'){
    app.use(morgan('dev'))
}

//Middleware to handle Handlebars
app.engine('.hbs', exphbs.engine ({
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
}))


//Passport middleware
app.use(passport.initialize())
app.use(passport.session())



//app.use(express.static('public')) works fine without path
app.use(express.static(path.join(__dirname, 'public')))

//Tells app to use routes
app.use('/', require('./routes/index'))
//app.use('/dashboard', require('./routes/index'))
app.use('/auth', require('./routes/auth'))

const PORT = process.env.PORT || 3000 

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on ${PORT}`))
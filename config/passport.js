const GoogleStrategy = require('passport-google-oauth20').Strategy
const mongoose = require('mongoose')


const User = require('../models/User')

module.exports = function(passport){
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback'

    },
    //what we get back is handled below
    async (accessToken, refreshToken, profile, done) => {
        //store data in db and reference as needed
        const newUser = {
            googleID: profile.id,
            displayName: profile.displayName,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            image: profile.photos[0].value
        }
        try{
            let user = await User.findOne({googleID: profile.id}) //does this ID already exist?
            if(user){done(null,user)
            }else {  //if user does not exist, create it using the schema
                user = await User.create(newUser)
                done(null,user)
            }
        }catch(err){
            console.error(err)
        }
    }
    ))
    //Serialize and de-serialize user
    passport.serializeUser(function (user,done){
        done(null,user.id)
    })
    passport.deserializeUser(function (id,done){
       User.findById( id, function(err,user){
        done(err,user)
       })
    })
}
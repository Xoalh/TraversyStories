const express = require('express')
const passport = require('passport')
const router = express.Router()

// Authenticate with google
//@route GET / auth/google
router.get('/google', passport.authenticate('google', {scope: ['profile'] } ))

//Google auth callback
//@route GET /auth/google/callback
router.get('/google/callback', passport.authenticate('google', {failureRedirect: '/' } ), (req,res) => {
res.redirect('/dashboard')
})

//@desc  Logout 
//@route GET/auth/logout
//now required to be async for security
router.get('/logout', (req,res, next) => {
    req.logout(function (err){
        if(err){return next(err)}
        res.redirect('/')
    })
})


module.exports = router
//Protect our routes. You won't be able to access the inner routes unless you are logged in

module.exports ={
    ensureAuth: function (req,res,next){
        if(res.isAuthenticated()){
            return next()
        }else {
            res.redirect('/')
        }
    },
    ensureGuest: function (req,res,next){
        if (req.isAuthenticated()){
            res.redirect('/dashboard')
        }else {
            return next()
        }
    }
}
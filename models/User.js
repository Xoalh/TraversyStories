const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    googleID:{
        type:String,
        required: true
    },
    displayName:{
        type:String,
        required: true
    },
    firstName:{
        type:String,
        required: true
    },
    lastName:{
        type:String,
        required: true
    },
    image:{
        type:String,
        
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
})

//will create a new collection users if doesn't already exist. you can add third arg with name of existing if 
//you'd rather do that.
module.exports = mongoose.model('User', UserSchema)
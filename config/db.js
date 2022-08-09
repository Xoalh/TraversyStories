const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        //The properties he adds are no longer needed
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB Connected: ${conn.connection.host}`)
    } catch (err) {
        console.log(err)
        process.exit(1)        
    }
}

//So we can use from app.js file
module.exports = connectDB
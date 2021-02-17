
const express = require('express')
const app = express()
const authRouter = require('./Routes/authRoutes')




app.use('/api', authRouter);



app.listen(3000,()=>{
    console.log("Listening to port 3000")
})

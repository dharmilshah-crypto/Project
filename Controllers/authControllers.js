const User = require('./../Models/userModel') 
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')
const {promisify} = require('util')



exports.generateOTP = async(req,res,next)=>{
    try{
        console.log("1")
        let a =Math.random()
        a=String(a)
        a=a.substring(2,6)
        console.log(a) 

        await User.updateOne({email : req.tempEmail},{otp : a})
        let message = {
            from: "rp218428@gmail.com",
            to: req.tempEmail,
            subject: "OTP",
            text: "Plaintext version of the message",
            html: `<p>OTP</p>
                      <p>${a}</p>`
          }
          console.log("message generated")
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            service : 'Gmail',
            
            auth: {
              user: 'rp218428@gmail.com',
              pass: '98934196'
            }
            
        })
        console.log("message sent")

        transporter.sendMail(message, (err, info) => {
            console.log(info.envelope);
            console.log(info.messageId);
        });
        res.status(404).send("OTP sent")
    }
    catch(err){
        res.status(404).send(err.message,err.name)
    }
}

exports.signUp = async (req,res,next)=>{
    try{
    
        
        const newUser = await User.create({
            name : req.body.name,
            email : req.body.email,
            password :req.body.password,
            confirmPassword : req.body.confirmPassword,
            balance : 25,
            isAdmin : false
        });
        
         req.tempEmail = req.body.email
 

next();
}
catch(err)
{
    res.status(400).send(err.message)
}
}


exports.logIn = async (req,res,next)=>{

    try{
        const user = await User.findOne({email : req.body.email})
       console.log(user)

    if(user.isVerified){
    const email = req.body.email
    const password = req.body.password
    if(!email || !password){
     throw new Error('Password or Email missing')
    }
const user = await  User.findOne({email}).select('+password')


if(!user || !await  user.correctPassword(password,user.password))
{
    throw new Error('Password or Email Incorrect',401)
}

    const token = jwt.sign({id : user._id},'secret',{expiresIn : '5m'})
   
    res.status(200).json({
        status : "success",
        token,
        user,
        message : "LogIn successfull "
    })
}
else throw new Error('You are not verified ,please verify yourself fisrt')
    }
catch(err)
{
    res.status(400).send(err.message)
}
}

exports.protect = async (req,res,next)=>{
    try{
       
     let token
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
       
        token = req.headers.authorization.split(' ')[1]
    }
 
    if(token == undefined)
    throw new Error('You are not logged in',401)
     
  
    const decoded = await promisify(jwt.verify)(token,'secret')
    req.tempId = decoded.id
     console.log(req.tempId)
    next()
    }
    catch(err){
       
        if(err.name === "TokenExpiredError"){
            res.status(401).send('Expired token ,Please Login again')
        }
        else if(err.name === "SyntaxError"){
            res.status(401).send('Invalid token ,Please Login again')
        }
        else res.status(401).send(err.message)
        
    }
}

exports.checkOTP= async(req,res,next)=>{
    try{

        let user
        let token
    if(req.body.otp)
    {
        let user = await User.findOne({email : req.body.email})
        console.log(user)
        if(req.body.otp == user.otp)
        { 
         token = jwt.sign({id : user._id},'secret',{expiresIn : '10m'})
         await User.updateOne({email : req.body.email},{isVerified : true}) 
         await User.updateOne({email : req.body.email},{otp : undefined}) 
         user = await User.findOne({email : req.body.email})
         console.log(user)
        res.status(200).json({
            status : "success", 
            token  
        })
        }

        else
        throw new Error('OTP did not match ,please generate an OTP again')
    }
    else
    throw new Error('OTP not found ,please generate an OTP again')
}catch(err){
    res.status(404).json({
        "name" : err.name,
       "message" : err.message})
}
}
const User = require('./../Models/userModel') 
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')
const {promisify} = require('util')



exports.mailHandler = async(req,res,next)=>{
    try{
        let a =Math.random()
        a=String(a)
        a=a.substring(2,6)
        console.log(a)
        process.env.otp = a
        let message = {
            from: "rp218428@gmail.com",
            to: "nevate1356@geeky83.com",
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
next()
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
            balance : 25
        });
        const token =jwt.sign({id : newUser._id},'secret',{expiresIn : '2m'})

 
    res.status(200).json({
    status : "success",
    token,
    newUser,
    message : "SignUp successfull "   
})
}
catch(err)
{
    res.status(400).send(err.message)
}
}


exports.logIn = async (req,res,next)=>{

    try{
    const email = req.body.email
    const password = req.body.password
    if(!email || !password){
     throw new Error('Password or Email missing')
    }
const user = await  User.findOne({email}).select('+password')
console.log(user)

if(!user || !await  user.correctPassword(password,user.password))
{
    throw new Error('Password or Email Incorrect',401)
}

    const token = jwt.sign({id : user._id},'secret',{expiresIn : '30s'})
    res.status(200).json({
        status : "success",
        token,
        message : "LogIn successfull "
    })
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
    if(req.body.otp)
    {
        
        if(req.body.otp == process.env.otp)
        { process.env.otp = undefined
            next()}

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
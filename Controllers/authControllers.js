const User = require('./../Models/userModel') 
const nodeMailer = require('nodemailer')
const jwt = require('jsonwebtoken')
const {promisify} = require('util')



exports.mailHandler = async(req,res,next)=>{
    try{
        // let transporter = nodemailer.createTransport({
        //     host: "smtp.gmail.com",
        //     port: 465,
        //     secure: true,
        //     service : 'Gmail',
            
        //     auth: {
        //       user: '',
        //       pass: '',
        //     }
            
        // })
next()
    }
    catch(err){

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
    if(!token)
    throw new Error('You are not logged in',401)
     
  
    const decoded = await promisify(jwt.verify)(token,'secret')
    next()
    }
    catch(err){
        if(err.name === "TokenExpiredError"){
            res.status(401).send('Expired taken ,Please Login again')
        }
        else if(err.name === "SyntaxError"){
            res.status(401).send('Invalid    taken ,Please Login again')
        }
        
    }
}


// exports.test = (req,res){

// }
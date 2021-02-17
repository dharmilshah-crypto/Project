exports.signUp = async (req,res,next)=>{
    try{
res.status(200).json({
    status : "success",
    message : "SignUp successfull "
})
}
catch(err)
{
    console.log(err.message)
}
}
exports.logIn = async (req,res,next)=>{
    try{
    res.status(200).json({
        status : "success",
        message : "LogIn successfull "
    })
}
catch(err)
{
    console.log(err.message)
}
}
const transaction = require('./../Models/transactionModel')
const User = require('../Models/userModel')  

exports.getAllTransactions = async (req,res,next)=>{
    try{
    const user = await User.findById(req.tempId)
    let Transactions
    if(user.isAdmin == true)
    { Transactions = await transaction.find()}
   else{
    Transactions = await transaction.find({$or:[{"sender" : `${user.email}`},{"receiver" : `${user.email}`}]})
 console.log(Transactions) 
}

    res.status(200).json({
       transactions : Transactions
    })
}
catch(err){
    res.status(404).json({
        status : "fail",
        message : err.message
    })
}
}
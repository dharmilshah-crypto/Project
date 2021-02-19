const User = require('../Models/userModel') 
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')

exports.getAllUsers=async (req,res,next)=>{
    try{

    const users = await User.find()
    res.status(200).json({
        status : "success",
        data : users
    })
}catch(err){
    res.status(400).json({
        status : "Failed",
        message : err.message
    })
}
}

exports.getOneUser =async (req,res,next) => {
    try{
    const user = await User.findById(req.params.id)
    if(!user)
    {return  res.status(404).json({
        staus :"fail",
        message : "No user present with that Id"
      })
    }
    else{
    res.status(201).json({
      status : "success",
      data :{
        user
      }
    })
}
      }
      catch(err){
    res.status(404).json({
      staus :"fail",
      message : err
    })
      }

}
exports.updateUser=async (req,res,next)=>{
    try{
        const user = await User.findByIdAndUpdate(req.params.id,req.body,{
          new :true,
          runValidators:true 
        })
        if(!user)
        {
          res.status(404).json({
            staus :"fail",
            message : "No user present with that Id"
          })
        }else{
          res.status(200).json({
            status: 'success',
            data: {
              user 
            }
          });
        }
        }catch(err){
        res.status(400).json({
             status : "failed",
             message : err
            });
        }
        }

        exports.deleteUser =async (req, res) => {
            try{
              const user = await User.findByIdAndDelete(req.params.id)
              console.log(user)
              if(!user)
          {
              return res.status(404).json({
              staus :"fail",
              message : "No user present with that Id"
            })
          }
              
            res.status(200).json({
              status: 'success',
              data: {
                deletedDataId : req.params.id
              }
            })
          }
          catch(err){
            res.status(204).json({
              status: 'failed'
          })
          }
          }

          exports.transaction = async (req,res,next)=>{
            try{
              console.log("1")
              let temp
            let transactionAmount = req.body.transactionAmount
            console.log(transactionAmount)
            let senderId = req.params.id
            console.log(senderId)
            let recieverId = req.body.id
            console.log(recieverId)
            let senderBalance = await User.findById(senderId).select('balance')
            console.log(senderBalance)
            let receiverBalance = await User.findById(recieverId).select('balance')
            console.log(receiverBalance)
            let receiver
            let sender
            if(transactionAmount<=senderBalance.balance)
            {
              temp = senderBalance.balance - transactionAmount
               sender = await User.findByIdAndUpdate(senderId,{balance : `${temp}`},{
                new :true,
                runValidators:true 
              })
              temp = receiverBalance.balance +  transactionAmount
               receiver = await User.findByIdAndUpdate(recieverId,{balance : `${temp}`},{
                new :true,
                runValidators:true 
              })
              
              let message = {
                from: "rp218428@gmail.com",
                to: "nevate1356@geeky83.com",
                subject: "Transaction Details",
                text: "Plaintext version of the message",
                html: `<p>Transaction details</p>
                          <p><h1>${transactionAmount} Rs has been sent to you</h1></p>`
              }
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
           
    
            transporter.sendMail(message, (err, info) => {
                console.log(info.envelope);
                console.log(info.messageId);
            });
            res.status(404).json({
              status : "success",
              message : "Mail regarding transaction has been sent",
              sender : sender,
              receiver : receiver
            })
    
            }
            else
            throw new Error ('Insufficient Balance')
        
            }
            catch(err)
            {
                  res.status(404).send(err.message)
            }
          }
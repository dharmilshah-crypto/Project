const User = require('../Models/userModel') 
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const transaction = require('../Models/transactionModel')

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
      
    const user = await User.find({"email" : req.params.id})
    console.log(user)
    if(user[0])
    {
      res.status(201).json({
        status : "success",
        data :{
          user
        }
      })
      
    }
    else{
    return  res.status(404).json({
      staus :"fail",
      message : "No user present with that Id"
    })
}
      }
      catch(err){
      res.status(404).json({
        staus :"fail",
        message : "No user present with that Id"
    })
      }

}
exports.updateUser=async (req,res,next)=>{
    try{
        const user = await User.updateOne({email : req.params.id},req.body,{
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
              const user = await User.deleteOne({email : req.params.id})
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
              const user = await User.findById(req.tempId)
              let temp
            let transactionAmount = req.body.transactionAmount
            
            let senderId = req.params.id
            
            if(user.email !== req.params.id)
            {
              return res.status(404).send("Not logged in ,Please login  to perform transactions")
            }
            let receiverId = req.body.email
            
            let senderBalance = await User.findOne({email : senderId}).select('balance')
       
            let receiverBalance = await User.findOne({email : receiverId}).select('balance')
           
            let receiver
            let sender
            if(transactionAmount<=senderBalance.balance)
            {
              temp = senderBalance.balance - transactionAmount
                await User.updateOne({email : senderId},{balance : `${temp}`},{
                new :true,
                runValidators:true 
              })
              temp = receiverBalance.balance +  transactionAmount
                await User.updateOne({email : receiverId},{balance : `${temp}`},{
                new :true,
                runValidators:true 
              })
              sender = await User.findOne({email : senderId})
              receiver = await User.findOne({email : receiverId})
              

              const transactionData = await transaction.create({
                "sender" : sender.email,
                "receiver" : receiver.email,
                "transactionAmount" : transactionAmount,
                "date" : new Date()
              })

              
              let message = {
                from: "rp218428@gmail.com",
                to: receiver.email,
                subject: "Transaction Details",
                text: "Plaintext version of the message",
                html: `<p>Transaction details</p>
                          <p><h1>$${transactionAmount} has been received from ${sender.email}</h1></p>`
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
              message = {
              from: "rp218428@gmail.com",
              to:sender.email ,
              subject: "Transaction Details",
              text: "Plaintext version of the message",
              html: `<p>Transaction details</p>
                        <p><h1>$${transactionAmount} has been sent from your account to ${receiver.email}</h1></p>`
            }
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
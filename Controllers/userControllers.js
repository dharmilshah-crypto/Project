const User = require('../Models/userModel') 
const jwt = require('jsonwebtoken')

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
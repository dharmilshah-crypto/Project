const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required : [true,"must have a name"],
        trim:true
      },
      age:{
        type: Number,
        trim:true
      },
      email :{
        type : String,
        required : [true,"Please tell us your email"],
        unique:[true],
        lowercase : true,
        validate :[validator.isEmail,'Please give a valid email']
    },
    password:{
        type: String,
        required : [true,'Please give a password'],
        minlength : 8,
        select : false
    },
    confirmPassword : {
        type : String,
        required : [true,'Please confirm your password'],
        validate : {
            validator :function(el){
                return el === this.password;
            },
            message : "Password is not same"
        }
            },
            balance : {
                type : Number
            },
            isAdmin  : {
                type : Boolean,
                select : true
            },
            isVerified : {
               type : Boolean
            },
            otp : {
                type : Number
            }
})
userSchema.methods.correctPassword = async function(candidatePassword,userPassword){
     return await bcrypt.compare(candidatePassword,userPassword)
} 


userSchema.pre('save',async function(next){
if(!this.isModified('password'))return next()

this.password = await bcrypt.hash(this.password,12)
this.confirmPassword = undefined
next()
})

const User = mongoose.model('user',userSchema);
module.exports = User;
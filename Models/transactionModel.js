const mongoose = require('mongoose')
const validator = require('validator')
const transactionSchema = new mongoose.Schema({
    sender :{
        type : String,
        required : [true,"Sender's email is necessary"],
        lowercase : true,
        validate :[validator.isEmail,"Sender's email is not valid"]
    },
    receiver :{
        type : String,
        required : [true,"Receiver's email is necessary"],
        lowercase : true,
        validate :[validator.isEmail,"Receiver's email is not valid"]
    },
    transactionAmount : {
        type : Number,
        required : [true,"Needs to have a amount for making a transaction"]
    },
    date : {
        type : Date
    }
})





const transaction = mongoose.model('transactions',transactionSchema);
module.exports = transaction;
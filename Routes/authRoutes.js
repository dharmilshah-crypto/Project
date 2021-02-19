const express = require('express')
const app = express()
const router = express.Router()
const authControllers = require('./../Controllers/authControllers')

router
.route('/generateotp')
.get(authControllers.mailHandler) 
 

router
.route('/signup')
.post(authControllers.checkOTP,authControllers.signUp)  

 router
.route('/login')
.post(authControllers.logIn)



module.exports = router
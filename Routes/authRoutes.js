const express = require('express')
const app = express()
const router = express.Router()
const authControllers = require('./../Controllers/authControllers')

router
.route('/generateotp')
.get() 
 

router
.route('/signup')
.post(authControllers.signUp,authControllers.generateOTP)  

 router
.route('/login')
.post(authControllers.logIn)

router
.route('/otplogin')
.post(authControllers.checkOTP)


module.exports = router
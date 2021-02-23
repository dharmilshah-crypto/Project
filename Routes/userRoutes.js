const express = require('express')
const app = express()
const router = express.Router()
const userControllers = require('./../Controllers/userControllers')
const authControllers = require('./../Controllers/authControllers')


router
.route('/users')
.get(authControllers.protect,userControllers.getAllUsers)

router
.route('/users/:id')
.get( authControllers.protect,userControllers.getOneUser)
.patch(authControllers.protect,userControllers.updateUser)
.delete(authControllers.protect,userControllers.deleteUser)

router
.route('/transaction/:id')
.post(authControllers.protect,userControllers.transaction)


module.exports = router
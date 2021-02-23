const express = require('express')
const app = express()
const router = express.Router()
const transactionControllers = require('./../Controllers/transactionControllers')
const authControllers = require('./../Controllers/authControllers')

router
.route('/gettransactions')
.get(authControllers.protect,transactionControllers.getAllTransactions)

module.exports = router
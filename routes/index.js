const express = require("express")
const router = express.Router() //load express.Router package
const home = require('./modules/home')
const restaurantList = require('./modules/restaurant')
const users = require('./modules/users')

const { authenticator } = require('../middleware/auth') // 掛載 middleware

//load homepage and every function

router.use('/restaurants', authenticator, restaurantList)  // 加入驗證程序
router.use('/users', users)
router.use('/', authenticator, home)  // 加入驗證程序

//exports this router
module.exports = router
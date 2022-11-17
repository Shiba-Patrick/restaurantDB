const express = require("express")
const router = express.Router() //load express.Router package
const home = require('./modules/home')
const restaurantList = require('./modules/restaurant')

//load homepage and every function
router.use('/', home)
router.use('/restaurants', restaurantList)

//exports this router
module.exports = router
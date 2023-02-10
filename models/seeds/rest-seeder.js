const db = require('../../config/mongoose')
const pre_restaurantList = require('./restaurant.json').results
const restaurantList = require('../rest-seed')

//載入dotenv環境變數做使用:不然連結不上資料庫
require('dotenv').config()

//create seed
db.once('open', () => {
   restaurantList.insertMany(pre_restaurantList)
   .then(()=>{
     console.log('done!!!')
     db.close
   })
   .catch(error => console.log(error))
})
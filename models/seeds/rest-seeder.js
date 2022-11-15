const mongoose = require('mongoose')
const pre_restaurantList = require('../../restaurant.json').results
const restaurantList = require('../rest-seed')

//載入dotenv環境變數做使用:不然連結不上資料庫
require('dotenv').config()

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection
db.on('error', () => {
  console.log('mongodb error!')
})

//create seed
db.once('open', () => {
  console.log('mongodb connected!')
  
   restaurantList.create(pre_restaurantList)
   .then(()=>{
     console.log('done!!!')
     db.close
   })
   .catch(error => console.log(error))
})
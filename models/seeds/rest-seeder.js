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
  for (let i = 0; i < pre_restaurantList.length; i++) {
    restaurantList.create({
      name: pre_restaurantList[i].name,
      name_en: pre_restaurantList[i].name_en,
      category: pre_restaurantList[i].category,
      image: pre_restaurantList[i].image,
      location: pre_restaurantList[i].locatio,
      phone: pre_restaurantList[i].phone,
      google_map: pre_restaurantList[i].google_map,
      google_map: pre_restaurantList[i].google_map,
      rating: pre_restaurantList[i].rating,
      description: pre_restaurantList[i].description,
    })
  }
  console.log('done!!!')
})
//宣告及取得需要的變數 express/handlebars
const express = require('express')
const express_hbs = require('express-handlebars')
const mongoose = require('mongoose')
const restaurantList = require('./restaurant.json')
const app = express()
const port = 3000

//setting handlebars engine & static files & body-parse
app.engine('handlebars', express_hbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

//setting env 
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

//Mongoose DataBase setting
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection

//connected error:on
db.on('error', () => {
  console.log('mongoose error!!!!')
})

//connected success:once
db.once('open', () => {
  console.log('mongo-db connected!!!')
})

//router setting:模板關鍵字為{#each:name : 封包資料的物件名稱}
app.get('/', (req, res) => {
  res.render('index', { restaurant_List: restaurantList.results })
})

//showPage router setting:運用params去設定動態路由
//運用find來搜尋路由id及資料id轉換成相同資料型態去比較
app.get('/restaurants/:rest_id', (req, res) => {
  const restList = restaurantList.results.find(restList =>
    restList.id.toString() === req.params.rest_id
  )
  res.render('show', { restList: restList })
})

//search-bar setting:by name or category
app.get('/search', (req, res) => {
  const keyword = req.query.keyword
  const restaurants = restaurantList.results.filter(restaurant => {
    return restaurant.name.toLowerCase().includes(keyword.toLowerCase()) ||
      restaurant.category.includes(keyword.toLowerCase())
  })
  res.render('index', { restaurant_List: restaurants, keyword: keyword })
})

//express listening
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})

//宣告及取得需要的變數 express/handlebars
const express = require('express')
const express_hbs = require('express-handlebars')
const mongoose = require('mongoose')
const bodyParser = require("body-parser");
const restaurantList = require('./models/rest-seed')
const app = express()
const port = 3000

//setting handlebars engine & static files & body-parse
app.engine('handlebars', express_hbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))

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

//瀏覽全部餐廳
app.get('/', (req, res) => {
  restaurantList.find()
    .lean()
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => console.log(error))
})

//新增餐廳
app.get('/restaurants/new', (req, res) => {
  res.render('new')
})

app.post('/restaurants', (req, res) => {
  restaurantList.create(req.body)
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

//showPage router setting:運用params去設定動態路由
//運用find來搜尋路由id及資料id轉換成相同資料型態去比較
app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id
  restaurantList.findById(id)
    .lean()
    .then(restaurants => res.render('show', { restaurants }))
    .catch(error => console.log(error))

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

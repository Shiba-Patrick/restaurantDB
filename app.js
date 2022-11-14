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

//新增餐廳:NewPage
app.get('/restaurants/new', (req, res) => {
  res.render('new')
})

app.post('/restaurants', (req, res) => {
  restaurantList.create(req.body)
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

//餐廳詳細資料:showPage
app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id
  restaurantList.findById(id)
    .lean()
    .then(restaurant => res.render('show', { restaurant }))
    .catch(error => console.log(error))

})

//餐廳搜尋:search-bar
app.get('/search', (req, res) => {
  const keyword = req.query.keyword.toLowerCase()
  restaurantList
    .find()
    .lean()
    .then(restaurants => {
      const restaurant = restaurants.filter(R =>
        R.name.toLowerCase().includes(keyword) ||
        R.category.toLowerCase().includes(keyword)
      )
      if (restaurant.length >= 1 || keyword === '') {
        res.render('index', { restaurants: restaurant, keyword })
      } else {
        res.render('no_results')
      }

    })
    .catch(error => console.log(error))
})

//餐廳編輯:editPage
app.get('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  restaurantList
    .findById(id)
    .lean()
    .then(restaurant => res.render('edit', { restaurant }))
    .catch(error => console.log(error))
})

app.post(('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id

  restaurantList
    .findByIdAndUpdate(id, req.body)
    .then(() => res.redirect(`/restaurants/${id}`))
    .catch(error => console.log(error))
}))

//餐廳刪除:delete
app.post('/restaurants/:id/delete', (req, res) => {
  const id = req.params.id
  restaurantList
    .findByIdAndRemove(id)
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})


//express listening
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})

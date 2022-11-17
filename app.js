//宣告及取得需要的變數 express/handlebars
const express = require('express')
const express_hbs = require('express-handlebars')
const bodyParser = require("body-parser");
const routes = require('./routes')// load routes
require('./config/mongoose') //load config mongoose

const app = express()
const port = 3000

//setting handlebars engine & static files & body-parse
app.engine('handlebars', express_hbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))

//use routes
app.use(routes)

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

//餐廳編輯:editPage
app.get('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  restaurantList.findById(id)
    .lean()
    .then(restaurant => res.render('edit', { restaurant }))
    .catch(error => console.log(error))
})

app.post('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  restaurantList.findByIdAndUpdate(id, req.body)
    .then(() => res.redirect(`/restaurants/${id}`))
    .catch(error => console.log(error))
})

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

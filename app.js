//宣告及取得需要的變數 express/handlebars
const express = require('express')
const express_hbs = require('express-handlebars')
const restaurantList = require('./restaurant.json')
const app = express()
const port = 3000

//setting handlebars engine
app.engine('handlebars', express_hbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

//setting static files
app.use(express.static('public'))

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

const express = require("express")
const router = express.Router()
const restaurantList = require('../../models/rest-seed')

  // 瀏覽全部餐廳
router.get('/', (req, res) => {
  restaurantList.find()
    .lean()
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => console.log(error))
})

//餐廳搜尋:search-bar
router.get('/search', (req, res) => {
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

module.exports = router
const express = require("express")
const router = express.Router()
const restaurantList = require('../../models/rest-seed')

//新增餐廳:NewPage
router.get('/new', (req, res) => {
  res.render('new')
})

router.post('/', (req, res) => {
  restaurantList.create(req.body)
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

//餐廳詳細資料:showPage
router.get('/:id', (req, res) => {
  const id = req.params.id
  restaurantList.findById(id)
    .lean()
    .then(restaurant => res.render('show', { restaurant }))
    .catch(error => console.log(error))

})

//餐廳編輯:editPage
router.get('/:id/edit', (req, res) => {
  const id = req.params.id
  restaurantList.findById(id)
    .lean()
    .then(restaurant => res.render('edit', { restaurant }))
    .catch(error => console.log(error))
})

router.put('/:id', (req, res) => {
  const id = req.params.id
  restaurantList.findByIdAndUpdate(id, req.body)
    .then(() => res.redirect(`/restaurants/${id}`))
    .catch(error => console.log(error))
})

//餐廳刪除:delete
router.delete('/:id', (req, res) => {
  const id = req.params.id
  restaurantList
    .findByIdAndRemove(id)
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

module.exports = router

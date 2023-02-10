const express = require("express")
const router = express.Router()
const restaurantList = require('../../models/rest-seed')

//修改頁面各種功能條件為使用者id,並且記得改成_id,findById改成fineOne

//新增餐廳:NewPage
router.get('/new', (req, res) => {
  res.render('new')
})

router.post('/', (req, res) => {
  const userId = req.user._id
  restaurantList.create({ ...req.body, userId})
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

//餐廳詳細資料:showPage
router.get('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  restaurantList.findOne({_id, userId})
    .lean()
    .then(restaurant => res.render('show', { restaurant }))
    .catch(error => console.log(error))

})

//餐廳編輯:editPage
router.get('/:id/edit', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  restaurantList.findOne({ _id, userId })
    .lean()
    .then(restaurant => res.render('edit', { restaurant }))
    .catch(error => console.log(error))
})

router.put('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  restaurantList.findOneAndUpdate({ _id, userId }, {...req.body, userId})
    .then(() => res.redirect(`/restaurants/${_id}`))
    .catch(error => console.log(error))
})

//餐廳刪除:delete
router.delete('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  restaurantList
    .findOneAndDelete({ _id, userId })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

module.exports = router

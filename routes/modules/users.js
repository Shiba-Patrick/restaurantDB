const express = require("express")
const passport = require('passport')
const bcrypt =require('bcryptjs')
const router = express.Router()
const User = require('../../models/user')

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  //新增errors陣列存放各種錯誤，並運用判斷式設定各條件下的提示
  const errors = []
  if (!name || !email || !password || !confirmPassword) {
    errors.push({ message: '欄位都必須填寫！' })
  }
  if (password !== confirmPassword) {
    errors.push({ message: '密碼與確認密碼不相符！' })
  }
  if (errors.length) {
    return res.render('register', {
      errors,
      name,
      email,
      password,
      confirmPassword
    })
  }

  User.findOne({ email }).then(user => {
    if (user) {
      errors.push({ message: '此Email已被註冊過了!' })  //mail已被使用提示框
      return res.render('register', {
        errors,
        name,
        email,
        password,
        confirmPassword
      })
    }

    return bcrypt 
    .genSalt(10)  // 產生「鹽」，並設定複雜度係數為 10
    .then(salt => bcrypt.hash(password, salt)) // 為使用者密碼「加鹽」，產生雜湊值
    .then(hash =>  User.create({
      name,
      email,
      password: hash // 用雜湊值取代原本的使用者密碼
    })
      .then(() => res.redirect('/'))
      .catch(err => console.log(err)))
  })
})

router.get('/logout', (req, res) => {
  req.logout()   // Passport.js 提供的函式,會幫你清除 session
  req.flash('success_msg', '您已成功登出！') //登入成功提示框
  res.redirect('/users/login')
})

module.exports = router
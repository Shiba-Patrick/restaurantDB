const express = require("express")
const passport = require('passport')
const bcrypt = require('bcryptjs')
const router = express.Router()
const User = require('../../models/user')

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', (req, res, next)=>{
  const { email, password } = req.body
  if( !email || !password){
    req.flash('warning_msg', '請再次確認您的信箱與密碼是否都有填寫')
    return res.redirect('/users/login')
  }
  next()
}, 
  passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login',
}))

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  //新增errors陣列存放各種錯誤，並運用判斷式設定各條件下的提示:其中名字為非必填項目
  const errors = []
  if (!email || !password || !confirmPassword) {
    errors.push({ message: 'Email、密碼與密碼確認都是必填欄位!' })
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
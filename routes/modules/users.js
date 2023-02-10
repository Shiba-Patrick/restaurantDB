const express = require("express")
const { route } = require("./home")
const router = express.Router()

router.get('/login', (req, res)=>{
  res.render('login')
})

router.post('/login', (req, res)=>{

})

router.get('/register', (req, res)=>{
  res.render('register')
})

module.exports = router
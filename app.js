//宣告及取得需要的變數 express/handlebars
const express = require('express')
const session = require('express-session')
const express_hbs = require('express-handlebars')
const bodyParser = require("body-parser");
const methodOverride = require('method-override')//load method-override
const flash = require('connect-flash')
const routes = require('./routes')// load routes

// 載入設定檔，要寫在 express-session 以後
const usePassport = require('./config/passport')

require('./config/mongoose') //load config mongoose

const app = express()
const port = 3000

//setting handlebars engine & static files & body-parse & method-override
app.engine('handlebars', express_hbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(express.static('public'))

//setting session
app.use(session({
  secret:'PatrickCode0214',
  resave: false,
  saveUninitialized: true
}))

app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

// 呼叫 Passport
usePassport(app)

//呼叫flash套件:並設定成功與警告訊息框
app.use(flash())
//設定狀態導覽列
app.use((req, res ,next)=>{
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  res.locals.success_msg = req.flash('success_msg')  
  res.locals.warning_msg = req.flash('warning_msg')
  next()
})

//use routes
app.use(routes)

//express listening
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})

//宣告及取得需要的變數 express/handlebars
const express = require('express')
const session = require('express-session')
const express_hbs = require('express-handlebars')
const bodyParser = require("body-parser");
const methodOverride = require('method-override')//load method-override
const routes = require('./routes')// load routes
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

//use routes
app.use(routes)

//express listening
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})

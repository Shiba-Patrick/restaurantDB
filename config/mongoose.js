const mongoose = require('mongoose')

//setting env 
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

//Mongoose DataBase setting
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection

//connected error:on
db.on('error', () => {
  console.log('mongoose error!!!!')
})

//connected success:once
db.once('open', () => {
  console.log('mongo-db connected!!!')
})

//匯出db
module.exports = db
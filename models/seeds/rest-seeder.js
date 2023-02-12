const db = require('../../config/mongoose')
const pre_restaurantList = require('./restaurant.json').results
const UserSeed = require('./user-seed.json').results //預設種子資料改變儲存型式
const restaurantList = require('../rest-seed')
const User = require('../user')
const bcrypt =require('bcryptjs')


if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

//create seed
db.once('open', () => {
   return Promise.all(
     UserSeed.map(user =>{
      const { restaurantIndex } = user

      return bcrypt
        .genSalt(10)
        .then(salt => bcrypt.hash(user.password, salt))
        .then(hash => User.create({
          name: user.name,
          email: user.email,
          password: hash
        }))

        .then((user) => {
          const restaurants = restaurantIndex.map(index => {
            const restaurant = pre_restaurantList[index]
            restaurant.userId = user._id
            return restaurant
          })
            return restaurantList.create(restaurants)
        })
            .catch(err => console.log(err))
    })
   )
   
   .then(()=>{
     console.log('done!!!')
     process.exit()
   })
   .catch(error => console.log(error))
})
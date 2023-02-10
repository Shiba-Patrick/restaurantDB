module.exports = {
  authenticator: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next()
    }
    req.flash('warning_msg', '請先登入！才能夠使用！')  //登入失敗提示框
    res.redirect('/users/login')
  }
}
const router = require('express').Router()
module.exports = router

router.use('/user', require('./user'))
router.use('/matches', require('./match'))
router.use('/questions', require('./question'))

router.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})


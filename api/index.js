const router = require('express').Router()
module.exports = router

router.use('/user', require('./user'))
router.use('/matches', require('./match'))

router.use('/questions', require('./question'))
router.use('/tags', require('./tags'))
router.use('/activity', require('./activity'))


router.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})

const router = require('express').Router()
module.exports = router

<<<<<<< HEAD
//if you aren't logged in, you shouldn't have access to any api routes -- you'll only be able to access auth routes, to log in

// router.use((req, res, next) => {
//   if (req.user) next()
//   else res.sendStatus(401)
// })

// const isAuthentic = (req, res, next) => {
//   if (req.user) next()
//   else res.sendStatus(401)
// }

// app.get('/dansSecretStash', isAuthentic, (req,res,next) => {
//   Secrets.findAll()
// })

=======
>>>>>>> master
router.use('/user', require('./user'))
router.use('/matches', require('./match'))
router.use('/questions', require('./question'))
router.use('/tags', require('./tags'))
router.use('/activity', require('./activity'))
router.use('/awsupload', require('./awsupload'))

router.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})

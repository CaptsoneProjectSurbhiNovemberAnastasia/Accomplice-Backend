const router = require('express').Router()
const User = require('../db/models/user')
module.exports = router
router.post('/login', async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email } })

    if (!user) {
      console.log('No such user found:', req.body.email)

      res.status(401).send('Wrong username and/or password')
    } else if (!user.correctPassword(req.body.password)) {
      console.log('Incorrect password for user:', req.body.email)

      res.status(401).send('Wrong username and/or password')
    } else {
      console.log(req.login)

      req.login(user, err => (err ? next(err) : res.json(user)))
    }
  } catch (e) {
    next(e)
  }
})

router.post('/signup', (req, res, next) => {
  User.create(req.body)
    .then(user => {
      res.json(user)
      //req.login(user, err => (err ? next(err) : res.json(user)))
    })
    .catch(err => {
      if (err.name === 'SequelizeUniqueConstraintError') {
        res.status(401).send('User already exists')
      } else {
        next(err)
      }
    })
})

router.get('/me', (req, res) => {
  res.json(req.user)
})

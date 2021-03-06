const router = require('express').Router()
const User = require('../db/models/user')
const SuggestedMatch = require('../db/models/suggestedmatch')
module.exports = router

router.post('/login', async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email } })
    console.log('user inside auth is****1  ' + JSON.stringify(user))
    if (!user) {
      console.log('No such user found:', req.body.email)

      res.status(401).send('Wrong username and/or password')
    } else if (!user.correctPassword(req.body.password)) {
      console.log('Incorrect password for user:', req.body.email)

      res.status(401).send('Wrong username and/or password')
    } else {
      console.log('Inside else block before getting sanitized values')
      console.log(
        'user inside auth is****2   ' +
          JSON.stringify('user inside auth is****3 ' + user)
      )
      res.json(user.getSanitizedDataValues())
      // req.login(
      //   user,
      //   err => (err ? next(err) : res.json(user.getSanitizedDataValues()))
      // )
      console.log(
        'user after all problems is ' +
          JSON.stringify(user.getSanitizedDataValues())
      )
    }
  } catch (err) {
    console.log('Error in retrieving user**********', err)
    next(err)
  }
})

router.post('/signup', async (req, res, next) => {
  try {
    const user = await User.create(req.body)
    const matchPool = await SuggestedMatch.findAll()
    user.encorporateIntoMatchPool(matchPool)
    req.login(
      user,
      err => (err ? next(err) : res.json(user.getSanitizedDataValues()))
    )
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      res.status(401).send('User already exists')
    } else {
      next(err)
    }
  }
})
router.post('/facebookLogin', async (req, res, next) => {
  console.log('creating user')
  try {
    let user = await User.findOne({ where: { email: req.body.email } })
    if (!user) user = await User.create(req.body)

    req.login(
      user,
      err => (err ? next(err) : res.json(user.getSanitizedDataValues()))
    )
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      res.status(401).send('User already exists')
    } else {
      next(err)
    }
  }
})
router.post('/logout', (req, res) => {
  req.logout()
  req.session.destroy()
  res.sendStatus(200)
})

router.get('/me', async (req, res, next) => {
  try {
    const sanitizedUser = req.user
      ? await req.user.getSanitizedDataValues()
      : {}
    res.json(sanitizedUser)
  } catch (e) {
    next(e)
  }
})

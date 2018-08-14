const router = require('express').Router()
const { Match } = require('../db/models')

module.exports = router

//GET /api/matches
router.get('/', (req, res, next) => {
  try {
      console.log('REQ USER', req.user)
      res.json(req.user).status(200)
  } catch (err) {
    next(err)
  }
})

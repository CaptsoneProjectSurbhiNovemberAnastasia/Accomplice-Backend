const router = require('express').Router()
const { User, Activity } = require('../db/models')

module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const you = await User.findById(req.user.id)
    const yourActivity = await you.getActivity()
    res.json(yourActivity)
  } catch (e) {
    next(e)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const you = await User.findById(req.user.id)
    const yourNewActivity = await Activity.create(req.body)
    await you.setActivity(yourNewActivity)
    const yourActivity = await you.getActivity()
    res.json(yourActivity)
  } catch (e) {
    next(e)
  }
})

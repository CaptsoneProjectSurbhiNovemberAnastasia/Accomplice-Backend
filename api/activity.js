const router = require('express').Router()
const { User, Activity, Tag } = require('../db/models')

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

    const yourActivityTags = []

    for (let i = 0; i < req.body.tags.length; i++) {
      const tag = await Tag.findById(req.body.tags[i].id)
      yourActivityTags.push(tag)
    }

    const yourNewActivity = await Activity.create({ name: req.body.name })

    await you.setActivity(yourNewActivity)

    await yourNewActivity.setTags(yourActivityTags)

    const yourActivity = await you.getActivity()

    res.json(yourActivity)
  } catch (e) {
    next(e)
  }
})

const router = require('express').Router()
const { User, Activity, Tag } = require('../db/models')

module.exports = router

router.get('/', async (req, res, next) => {
  try {
    //    console.log('req.user is ************' + JSON.stringify(req.user))
    // if (!req.user) {
    //   console.log('User not found******')
    //   res.json({}).status(200)
    //   return
    // }
    const you = await User.findById(req.user.id)
    console.log('you  is****** ' + JSON.stringify(you))
    const yourActivity = await you.getActivity()
    console.log('yourActivity is ' + JSON.stringify(yourActivity))
    res.json(yourActivity)
  } catch (e) {
    console.log('error is ' + e)
    next(e)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const you = await User.findById(req.user.id)

    const yourNewActivity = await Activity.create({ name: req.body.name })

    await you.setActivity(yourNewActivity)

    const yourActivity = await you.getActivity()

    res.json(yourActivity)
  } catch (e) {
    next(e)
  }
})

router.post('/tags', async (req, res, next) => {
  try {
    const you = await User.findById(req.user.id)
    const yourActivity = await you.getActivity()
    const yourActivityTags = []

    for (let i = 0; i < req.body.tags.length; i++) {
      const tag = await Tag.findById(req.body.tags[i].id)
      yourActivityTags.push(tag)
    }

    await yourActivity.setTags(yourActivityTags)
    res.json(yourActivityTags)
  } catch (e) {
    next(e)
  }
})

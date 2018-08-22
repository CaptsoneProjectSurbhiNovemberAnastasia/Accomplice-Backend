const router = require('express').Router()
const { Tag, User } = require('../db/models')

module.exports = router

router.get('/', async (req, res, next) => {
  try {
    if (!req.user) {
      res.json([]).status(200)
      return
    }
    const tags = await Tag.findAll()

    const you = await User.findById(req.user.id)
    const yourTags = await you.getTags()
    const yourActivity = await you.getActivity()
    let yourActivityTags = []
    if (yourActivity) {
      yourActivityTags = await yourActivity.getTags()
    }
    const yourActivityTagIds = yourActivityTags.map(tag => tag.id)
    const yourTagIds = yourTags.map(tag => tag.id)
    const tagsWithData = tags.map(tag => {
      if (yourTagIds.includes(tag.id)) {
        tag.dataValues.selected = true
      } else {
        tag.dataValues.selected = false
      }

      if (yourActivityTagIds.includes(tag.id)) {
        tag.dataValues.activity = true
      } else {
        tag.dataValues.activity = false
      }

      return tag
    })
    res.json(tagsWithData)
  } catch (e) {
    next(e)
  }
})

router.post('/', async (req, res, next) => {
  try {
    if (!req.user) {
      res.json([])
      return
    }

    const you = await User.findById(req.user.id)
    const tagIds = req.body.map(tag => tag.id)
    const tags = []
    for (let i = 0; i < tagIds.length; i++) {
      let tag = await Tag.findById(tagIds[i])
      tags.push(tag)
    }
    await you.setTags(tags)
    const yourTags = await you.getTags()
    res.json(yourTags).status(201)
  } catch (e) {
    next(e)
  }
})

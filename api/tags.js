const router = require('express').Router()
const { Tag, User } = require('../db/models')

module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const you = await User.findById(req.user.id)
    const yourTags = await you.getTags()
    const yourTagIds = yourTags.map(tag => tag.id)
    const tags = await Tag.findAll()
    const tagsWithSelected = tags.map(tag => {
      if (yourTagIds.includes(tag.id)) {
        tag.dataValues.selected = true
      } else {
        tag.dataValues.selected = false
      }

      return tag
    })
    res.json(tagsWithSelected)
  } catch (e) {
    next(e)
  }
})

router.post('/', async (req, res, next) => {
  try {
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

const router = require('express').Router()
const { Tag, User } = require('../db/models')

module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const tags = await Tag.findAll()
    res.json(tags)
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
    await you.addTags(tags)
    const yourTags = await you.getTags()
    res.json(yourTags).status(201)
  } catch (e) {
    next(e)
  }
})

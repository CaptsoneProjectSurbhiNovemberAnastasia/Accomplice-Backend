const router = require('express').Router()
const { Question } = require('../db/models')

module.exports = router

//GET /api/question
router.get('/', async (req, res, next) => {
  try {
    const allQuestions = await Question.findAll()
    res.json(allQuestions)
  } catch (err) {
    next(err)
  }
})

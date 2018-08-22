const router = require('express').Router()
const { Match, User } = require('../db/models')

module.exports = router

//GET /api/matches
router.get('/', async (req, res, next) => {
  try {
    const matchedWithEachOther = []
    if (req.user) {
      const yourUserId = req.user.id

      const yourMatches = await Match.findAll({ where: { userId: yourUserId } })

      const matchedWithYou = await Match.findAll({
        where: { matchedId: yourUserId },
      })

      for (let i = 0; i < yourMatches.length; i++) {
        if (
          matchedWithYou.some(
            match => match.userId === yourMatches[i].matchedId
          )
        ) {
          const yourMatch = await User.findById(yourMatches[i].matchedId)
          matchedWithEachOther.push(yourMatch)
        }
      }
    }
    res.json(matchedWithEachOther)
  } catch (err) {
    next(err)
  }
})

router.post('/:id', async (req, res, next) => {
  try {
    const yourUserId = req.user.id
    const you = await User.findById(yourUserId)
    const them = await User.findById(+req.params.id)
    await you.addMatched(them)
    const theirMatches = await them.getMatched()
    if (theirMatches.some(match => match.matchedId === you.id)) {
      res.json(them.getSanitizedDataValues())
    } else {
      res.sendStatus(200)
    }
  } catch (err) {
    next(err)
  }
})

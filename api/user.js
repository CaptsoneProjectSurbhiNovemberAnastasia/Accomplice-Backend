const router = require('express').Router()
const { SuggestedMatchesPerUser, User } = require('../db/models')

module.exports = router

//GET /api/user/:id single user
router.get('/:id', async (req, res, next) => {
  try {
    if (req.user.id === req.params.id) {
      const user = await User.findById(req.params.id)
      res.json(user).status(200)
    } else {
      res.send('mind yer own business').status(403)
    }
  } catch (err) {
    next(err)
  }
})

//GET /api/user/:id:/suggestedmatches
router.get('/:id/suggestedmatches', async (req, res, next) => {
  try {
    const ourUserId = Number(req.params.id)
    console.log('req.user object in api/user', req.user)
    if (req.user.id === ourUserId) {
      const match = await SuggestedMatchesPerUser.findOne({
        where: { userId: ourUserId },
      })

      if (!match) res.send('user not matched!').status(501)
      const matchId = match.suggestedMatchId

      const possibleUserMatchIds = await SuggestedMatchesPerUser.findAll({
        where: { suggestedMatchId: matchId },
      })

      let possibleMatches = []
      for (var i = 0; i < possibleUserMatchIds.length; i++) {
        if (possibleUserMatchIds[i].userId === ourUserId) {
          possibleUserMatchIds.splice(i, 1)
        }
        possibleMatches.push(
          await User.findOne({ where: { id: possibleUserMatchIds[i].userId } })
        )
      }

      res.json(possibleMatches).status(200)
    } else {
      res.send('Mind your own business!').status(403)
    }
  } catch (e) {
    next(e)
  }
})

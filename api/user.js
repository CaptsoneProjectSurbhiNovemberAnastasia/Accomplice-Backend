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
      res.send('FORBIDDEN').status(403)
    }
  } catch (err) {
    next(err)
  }
})

//GET /api/user/:id:/suggestedmatches
router.get('/:id/suggestedmatches', async (req, res, next) => {
  try {
    const ourUserId = Number(req.params.id)
    if (req.user.id === ourUserId) {
      const match = await SuggestedMatchesPerUser.findOne({
        where: { userId: ourUserId },
      })
      if (match) {
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
            await User.findOne({
              where: { id: possibleUserMatchIds[i].userId },
            })
          )
        }

        res.json(possibleMatches).status(200)
      } else {
        res.send('No matches found')
      }
    } else {
      res.send('FORBIDDEN').status(403)
    }
  } catch (e) {
    next(e)
  }
})

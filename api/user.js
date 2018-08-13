const router = require('express').Router()
const { SuggestedMatchesPerUser, User } = require('../db/models')

module.exports = router

//GET /api/user/:id single user
router.get('/:id', async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.params.id)
    res.json(currentUser).status(200)
  } catch (err) {
    next(err)
  }
})

//GET /api/users/:id:/suggestedmatches
router.get('/:id/suggestedmatches', async (req, res, next) => {
  try {
    const ourUserId = Number(req.params.id)
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
  } catch (e) {
    next(e)
  }
})

// router.get('/', (req, res, next) => {
//   res.send({ test: 'data' });
// });

//update a user's profile
// router.put('/:userId', (req, res, next) => {
//   User.findById(req.params.userId)
//     .then(user => {
//       user.update(req.body).then(editedUser => res.json(editedUser));
//     })
//     .catch(next);
// });

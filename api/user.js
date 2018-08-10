const router = require('express').Router()
const { Op } = require(Sequelize)
const { SuggestedMatchesPerUser, User } = require('../db/models')
module.exports = router

router.get('/:id/suggestedmatches', async (req, res, next) => {
  try {
    const userId = req.params.id

    const match = await SuggestedMatchesPerUser.findOne({ where: { userId } })

    const matchId = match.suggestedmatchId

    const possibleUserMatchIds = await SuggestedMatchesPerUser.findAll({
      where: { suggestedmatchId: matchId, userId: { [Op.not]: userId } },
    })

    const possibleMatches = await User.findAll({
      where: { id: { [Op.in]: possibleUserMatchIds } },
    })

    res.json(possibleMatches).status(200)
  } catch (e) {
    next(e)
  }
})

// get all users
router.get('/', (req, res, next) => {
  User.findAll()
    .then(users => res.json(users))
    .catch(e => next(e))
})

//update a user's profile
// router.put('/:userId', (req, res, next) => {
//   User.findById(req.params.userId)
//     .then(user => {
//       user.update(req.body).then(editedUser => res.json(editedUser));
//     })
//     .catch(next);
// });

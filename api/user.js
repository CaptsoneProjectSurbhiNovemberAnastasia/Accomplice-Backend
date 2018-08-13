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

    const match = await SuggestedMatchesPerUser.findOne({ where: { userId: ourUserId } })

    const matchId = match.suggestedMatchId

    const possibleUserMatchIds = await SuggestedMatchesPerUser.findAll({
      where: { suggestedMatchId: matchId}
    })

    let possibleMatches = [];
    for (var i = 0; i < possibleUserMatchIds.length; i++) {
      if (possibleUserMatchIds[i].userId === ourUserId) {
        possibleUserMatchIds.splice(i, 1)
      }
      possibleMatches.push(await User.findOne({where: { id: possibleUserMatchIds[i].userId}}))
    }

    res.json(possibleMatches).status(200)
  } catch (e) {
    next(e)
  }
})

router.post('/login', (req, res, next) => {
  User.findOne({ where: { email: req.body.email } })
    .then(user => {
      if (!user) {
        res.status(401).send('User not found')
      } else if (!user.correctPassword(req.body.password)) {
        res.status(401).send('Incorrect password')
      } else {
        res.json(user)
        //req.login(user, err => (err ? next(err) : res.json(user)))
      }
    })
    .catch(next)
})

router.post('/signup', (req, res, next) => {
  User.create(req.body)
    .then(user => {
      res.json(user)
      //req.login(user, err => (err ? next(err) : res.json(user)))
    })
    .catch(err => {
      if (err.name === 'SequelizeUniqueConstraintError') {
        res.status(401).send('User already exists')
      } else {
        next(err)
      }
    })
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


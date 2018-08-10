const router = require('express').Router()
const { SuggestedMatch } = require('../db/models')
module.exports = router

//Get all matches belonging to the logged-in user-- requires the user to be logged in so the currentUser's id can be passed to req.body
router.get('/:userId', (req, res, next) => {
  const currentUser = SuggestedMatch.findById(req.params.userId)
    .then(currentUser => res.json(currentUser))
    .catch(next)
})

//Add a match to a logged-in user
router.get('/', (req, res, next) => {
  SuggestedMatch.findOrCreate({
    where: {
      suggestedmatchId: req.body.suggestedmatchId,
      userId: req.body.userId
    }
  })
    .then(newMatch => res.json(newMatch[0]))
    .catch(err => console.log(err))
})

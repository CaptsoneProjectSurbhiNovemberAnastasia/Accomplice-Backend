const router = require('express').Router()
const { SuggestedMatchesPerUser, User } = require('../db/models')

module.exports = router

router.use(async (req, res, next) => {
  try {
    const you = await User.findById(req.user.id)
    const yourActivity = await you.getActivity()
    const yourActivityTags = await yourActivity.getTags()
    yourActivity.dataValues.tags = yourActivityTags
    req.user.activity = yourActivity
    next()
  } catch (e) {
    next(e)
  }
})
//GET /api/user/:id single user
router.get('/:id', (req, res, next) => {
  try {
    res.json(req.user)
  } catch (err) {
    next(err)
  }
})

//PUT /api/user/:id
router.put('/:id', async (req, res, next) => {
  try {
    const userToUpdate = await User.findById(req.params.id)
    const updatedUser = await userToUpdate.update(req.body)
    res.send(updatedUser).status(200)
  } catch (err) {
    next(err)
  }
})

//GET /api/user/:id:/suggestedmatches
router.get('/:id/suggestedmatches', async (req, res, next) => {
  try {
    const ourUserId = Number(req.params.id)
    if (req.user.id === ourUserId) {
      const matches = await SuggestedMatchesPerUser.findAll({
        where: { userId: ourUserId },
      })
      if (matches) {
        const matchIds = matches.map(a => a.suggestedMatchId)

        let possibleUserMatchIds = []

        // instead of Op.in we have to use a for loop...
        for (let i = 0; i < matchIds.length; i++) {
          let currentMatchIds = await SuggestedMatchesPerUser.findAll({
            where: { suggestedMatchId: matchIds[i] },
          })
          possibleUserMatchIds = possibleUserMatchIds.concat(currentMatchIds)
        }

        //filter out ourself
        possibleUserMatchIds = possibleUserMatchIds.filter(
          mch => mch.userId !== ourUserId
        )

        let possibleMatches = []

        // again, Op.in doesn't work for some reason, so a for loop
        for (let i = 0; i < possibleUserMatchIds.length; i++) {
          possibleMatches.push(
            await User.findOne({
              where: { id: possibleUserMatchIds[i].userId },
            })
          )
        }

        // filter out duplicates
        let keys = possibleMatches.map(ele => ele.id)
        possibleMatches = possibleMatches.filter(
          (ele, i) => keys.indexOf(ele.id) === i
        )

        // now we need each user's activity and its tags
        for (let i = 0; i < possibleMatches.length; i++) {
          if (possibleMatches[i].activityId) {
            const theirActivity = await possibleMatches[i].getActivity()
            const theirActivityTags = await theirActivity.getTags()
            // just put the activity and tags on there so we can look at it on the front end
            theirActivity.dataValues.tags = theirActivityTags
            possibleMatches[i].dataValues.activity = theirActivity
          }
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

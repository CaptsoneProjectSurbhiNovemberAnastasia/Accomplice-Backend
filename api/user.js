const router = require('express').Router()
const { SuggestedMatchesPerUser, User, Trait } = require('../db/models')

module.exports = router

//PUT /api/user/:id
router.put('/:id', async (req, res, next) => {
  try {
    if (!req.user) res.json({})
    if (req.user.id !== +req.params.id) {
      res.sendStatus(401)
    }
    const userToUpdate = await User.findById(req.user.id)
    const updatedUser = await userToUpdate.update({
      description: req.body.description || userToUpdate.description,
      imageUrl: req.body.imageUrl || userToUpdate.imageUrl,
      age: req.body.age || userToUpdate.age,
      firstName: req.body.firstName || userToUpdate.firstName,
      lastName: req.body.lastName || userToUpdate.lastName,
      latitude: req.body.latitude || userToUpdate.latitude,
      longitude: req.body.longitude || userToUpdate.longitude,
    })
    res.send(updatedUser.getSanitizedDataValues()).status(200)
  } catch (err) {
    next(err)
  }
})

//GET /api/user/:id:/suggestedmatches
router.get('/:id/suggestedmatches', async (req, res, next) => {
  try {
    if (!req.user) {
      res.json([])
      return
    }

    if (req.user.id !== +req.params.id) {
      res.sendStatus(401)
      return
    }
    const ourUserId = Number(req.user.id)
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
  } catch (e) {
    next(e)
  }
})

//PUT /api/user/traits
router.post('/traits', async (req, res, next) => {
  try {
    if (!req.user) res.json([])
    const traits = await Trait.findAll()
    const you = await User.findById(req.user.id)

    for (let i = 0; i <= 5; i++) {
      await you.addTrait(traits[i], {
        through: { value: req.body.userTraitValues[i] },
      })
    }

    const yourTraits = await you.getTraits()

    res.json(yourTraits)
  } catch (err) {
    next(err)
  }
})

'use strict'

const db = require('../db')

const { User, Trait, Tag, Question, Activity } = require('../db/models')

const userData = require('./usersdata2.json')

// necessary for sequelize functions such as and/or
// see http://docs.sequelizejs.com/manual/tutorial/querying.html

/**
 * Welcome to the seed file! This seed file uses a newer language feature called...
 *
 *                  -=-= ASYNC...AWAIT -=-=
 *
 * Async-await is a joy to use! Read more about it in the MDN docs:
 *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function
 *
 * Now that you've got the main idea, check it out in practice below!
 */

async function traitSeed() {
  try {
    const traits = await Promise.all([
      Trait.create({ name: 'Extraversion' }),
      Trait.create({ name: 'EmotionalStability' }),
      Trait.create({ name: 'Agreeableness' }),
      Trait.create({ name: 'Conscientiousness' }),
      Trait.create({ name: 'Intellect / Imagination' }),
    ])

    console.log(`seeded ${traits.length} traits`)
  } catch (e) {
    console.error(e)
  }
}

async function tagSeed() {
  try {
    const tags = await Promise.all([
      Tag.create({ name: 'Athletic' }),
      Tag.create({ name: 'Indoor' }),
      Tag.create({ name: 'Artistic' }),
      Tag.create({ name: 'Outdoor' }),
      Tag.create({ name: 'Relaxing' }),
    ])

    console.log(`seeded ${tags.length} tags`)
  } catch (e) {
    console.error(e)
  }
}

async function activitySeed() {
  try {
    const activities = await Promise.all([
      Activity.create({ name: 'go fishing' }),
      Activity.create({ name: 'go rock climbing' }),
      Activity.create({ name: 'go to the MoMA' }),
      Activity.create({ name: 'go to the beach' }),
      Activity.create({ name: 'go to the park' }),
      Activity.create({ name: "see 'Sorry to Bother You'" }),
    ])
    const tags = await Tag.findAll()

    for (let i = 0; i < activities.length; i++) {
      const randomTags = tags.slice([Math.floor(Math.random() * tags.length)])
      await activities[i].addTags(randomTags)
    }
    console.log(`seeded ${activities.length} activities`)
  } catch (e) {
    console.error(e)
  }
}

async function questionSeed() {
  try {
    let traits = await Trait.findAll()
    let j = 0
    let questions = [
      'I am the life of the party.',
      'I am interested in people.',
      "I don't mind being the center of attention.",
      "I don't get stressed out easily.",
      'I worry about irrelevent things.',
      "I don't have many mood swings.",
      'I often compliment people.',
      'I usually go with the flow when it comes to group plans.',
      'I seldom start fights with people.',
      'I make people feel at ease.',
      'I am interested in other what others have to say.',
      "I often recognize people's emotions around me.",
      'I have a rich vocabulary.',
      'I am interested in abstract ideas.',
      'I have a lot of creative ideas.',
    ]
    for (var i = 0; i < questions.length; i++) {
      let currentQuestion = await Question.create({ question: questions[i] })
      if (i % 3 === 0 && i !== 0) j++
      await currentQuestion.setTrait(traits[j])
    }
    console.log(`seeded ${questions.length} questions`)
  } catch (err) {
    console.log(err)
  }
}

async function userSeed() {
  try {
    const traits = await Trait.findAll()
    const activities = await Activity.findAll()
    for (let i = 0; i < (userData.length / 2); i++) {
      let randomNumberForImage = Math.floor(Math.random() * 100)
      let gender
      randomNumberForImage % 2 ? (gender = 'men') : (gender = 'women')

      userData[i].imageUrl =
        'https://randomuser.me/api/portraits/' +
        gender +
        '/' +
        randomNumberForImage +
        '.jpg'

      const currentUser = await User.create(userData[i])

      for (let j = 0; j < traits.length; j++) {
        await currentUser.addTrait(traits[j], {
          through: { value: Math.floor(Math.random() * 100) },
        })
      }

      currentUser.setActivity(
        activities[Math.floor(Math.random() * activities.length)]
      )
    }

    console.log(`seeded ${userData.length} users`)
  } catch (e) {
    console.error(e)
  }
}
// We've separated the `seed` function from the `runSeed` function.
// This way we can isolate the error handling and exit trapping.
// The `seed` function is concerned only with modifying the database.
async function runSeed() {
  console.log('seeding...')
  try {
    await db.sync({ force: true })
    console.log('db synced!')
    await traitSeed()
    await questionSeed()
    await tagSeed()
    await activitySeed()
    await userSeed()
    console.log('closing db connection')
    await db.close()
    console.log('db connection closed')
  } catch (err) {
    console.error(err)
    process.exitCode = 1
  }
}

// Execute the `seed` function, IF we ran this module directly (`node seed`).
// `Async` functions always return a promise, so we can use `catch` to handle
// any errors that might occur inside of `seed`.
//const seed = () => {
if (module === require.main) {
  runSeed()
}
//}

// we export the seed function for testing purposes (see `./seed.spec.js`)
module.exports = runSeed

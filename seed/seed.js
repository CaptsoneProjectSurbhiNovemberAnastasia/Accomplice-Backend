'use strict'

const db = require('../db')
const { User, Trait, UserTrait, Tag, Question } = require('../db/models')

const userData = require('./usersdata2.json')

// necessary for sequelize functions such as and/or
// see http://docs.sequelizejs.com/manual/tutorial/querying.html
const Sequelize = require('sequelize')
const Op = Sequelize.Op

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
      Trait.create({ name: 'Intellect / Imagination' })
    ])

    console.log(`seeded ${traits.length} traits`)
  } catch (e) {
    console.log(e)
  }
}

async function tagSeed() {
  try {
    const categories = await Promise.all([
      Tag.create({ name: 'Athletic' }),
      Tag.create({ name: 'Indoor' }),
      Tag.create({ name: 'Artistic' })
    ])

    console.log(`seeded ${categories.length} categories`)
  } catch (e) {
    console.log(e)
  }
}

async function questionSeed() {
  try {
    let traits = await Trait.findAll()
    let j = 0;
    let questions = ["I am the life of the party.", "I am interested in people.", "I don't mind being the center of attention.", "I don't get stressed out easily.", "I worry about irrelevent things.", "I don't have many mood swings.", "I often compliment people.", "I usually go with the flow when it comes to group plans.", "I seldom start fights with people.", "I make people feel at ease.", "I am interested in other what others have to say.", "I often recognize people's emotions around me.", "I have a rich vocabulary.", "I am interested in abstract ideas.", "I have a lot of creative ideas."]
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
    let traits = await Trait.findAll()
    for (let i = 0; i < userData.length; i++) {
      let randomNumberForImage = Math.floor(Math.random() * 100)
      let gender = 'men'
      if (randomNumberForImage % 2 === 0) {
        gender = 'women'
      }
      userData[i].imageUrl =
        'https://randomuser.me/api/portraits/' +
        gender +
        '/' +
        randomNumberForImage +
        '.jpg'

      const currentUser = await User.create(userData[i])
      traits.forEach(async trait => {
        try {
          await currentUser.addTrait(trait, {
            through: { value: Math.floor(Math.random() * 100) }
          })
        } catch (e) {
          console.log(e)
        }
      })
    }

    console.log(`seeded ${userData.length} users`)
  } catch (e) {
    console.log(e)
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
    await userSeed()
    await tagSeed()
  } catch (err) {
    console.error(err)
    process.exitCode = 1
  } finally {
    console.log('closing db connection')
    await db.close()
    console.log('db connection closed')
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

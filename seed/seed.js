'use strict'

const db = require('../db')
const { User, Trait, UserTrait, Tag } = require('../db/models')

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

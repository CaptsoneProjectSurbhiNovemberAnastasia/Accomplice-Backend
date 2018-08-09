'use strict'

const db = require('../server/db')
const { User, Trait, UserTrait, Category } = require('../server/db/models')

const userData = require('./usersdata.json')
// const userseed = path.join(__dirname, './usersdata.json');
// const dataArr = fs.readFileSync(userseed, 'utf8').split('\n');

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
  const traits = await Promise.all([
    Trait.create({ name: 'Extraversion' }),
    Trait.create({ name: 'EmotionalStability' }),
    Trait.create({ name: 'Agreeableness' }),
    Trait.create({ name: 'Conscientiousness' }),
    Trait.create({ name: 'Intellect / Imagination' }),
  ])

  console.log(`seeded ${traits.length} traits`)
}

async function categorySeed() {
  const categories = await Promise.all([
    Category.create({ name: 'Athletic' }),
    Category.create({ name: 'Indoor' }),
    Category.create({ name: 'Artistic' }),
  ])

  console.log(`seeded ${categories.length} categories`)
}

async function userSeed() {
  let traits = await Trait.findAll()
  for (let i = 0; i < userData.length; i++) {
    const currentUser = User.create(userData[i])
    traits.forEach(trait => {
      currentUser.addTrait(trait, { value: Math.random() * 100 })
    })
  }

  console.log(`seeded ${userData.length} users`)
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
    await categorySeed()
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

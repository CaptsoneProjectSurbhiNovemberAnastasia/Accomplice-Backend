const Population = require('./Population')
const RArray = require('./RArray')
const Sequelize = require('sequelize')
const AlgorithmUser = require('./User')
const { User, Trait, SuggestedMatch } = require('../db/models')

const runNTimes = (f, n, ...args) => {
  for (let i = 0; i < n; i++) {
    f(...args)
  }
}

const init = async () => {
  try {
    let allUsers = await User.findAll({ include: [{ model: Trait }] })
    allUsers = allUsers.map(user => new AlgorithmUser(user))
    allUsers = new RArray(...allUsers)

    let pC = 0.8
    let pM = 0.005
    let popSize = 50
    let seed = allUsers
    let ourPopulation

    const runAlgorithm = n => {
      ourPopulation = new Population(popSize, seed, pC, pM)

      const tick = () => {
        ourPopulation.nextGeneration()
      }

      runNTimes(tick, n)
      return ourPopulation
    }

    const evolvedPopulation = runAlgorithm(10000)

    await SuggestedMatch.destroy({ where: {} })
    evolvedPopulation.currentPopulation.forEach(async (individual, i) => {
      const currentIndividual = await SuggestedMatch.create({ id: i + 1 })
      individual.forEach(async user => {
        const currentUser = await User.findById(user.id)
        await currentUser.addSuggestedMatch(currentIndividual)
      })
    })

    return evolvedPopulation
  } catch (e) {
    console.log(e)
  }
}

init()
  .then(pop => console.log(pop.getAverageFitness()))
  .catch(e => console.log(e))
  .finally(() => process.exit())
module.exports = init

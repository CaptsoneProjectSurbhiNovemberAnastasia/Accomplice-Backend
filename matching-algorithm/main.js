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
    await SuggestedMatch.destroy({ where: {} })

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

    const evolvedPopulation = runAlgorithm(10)

    const allIndividuals = evolvedPopulation.currentPopulation
    // phew...
    for (let i = 0; i < allIndividuals.length; i++) {
      const currentIndividual = allIndividuals[i].dna
      const modelOfCurrentIndividual = await SuggestedMatch.create({})
      for (let j = 0; j < currentIndividual.length; j++) {
        const userInsideIndividual = currentIndividual[j]
        const userFromDB = await User.findById(userInsideIndividual.id)
        await userFromDB.addSuggestedmatch(modelOfCurrentIndividual)
      }
    }

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

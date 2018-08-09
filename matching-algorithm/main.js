const Population = require('./Population')
const RArray = require('./RArray')
const Sequelize = require('sequelize')
const AlgorithmUser = require('./User')
const { User, Trait } = require('../db/models')

const runNTimes = (f, n, ...args) => {
  for (let i = 0; i < n; i++) {
    f(...args)
  }
}

const init = async () => {
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

  return runAlgorithm(1).currentPopulation
}
console.log(init())
module.exports = init


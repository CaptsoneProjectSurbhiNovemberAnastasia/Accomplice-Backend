const Population = require('./Population')
const RArray = require('./RArray')
const Sequelize = require('sequelize')
const { User } = require('../db/models')

const init = async () => {
  const allUsers = new RArray()

  // IN PROGRESS

  var pC = 0.8
  var pM = 0.005
  var popSize = 50
  var seed = allUsers
  let ourPopulation
  let genNumber = 0
  let highest = 0

  const runAlgorithm = () => {
    ourPopulation = new Population(popSize, seed, pC, pM)

    const tick = () => {
      ourPopulation.nextGeneration()
      genNumber++
    }
  }
}

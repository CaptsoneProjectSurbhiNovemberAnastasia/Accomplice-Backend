const User = require('./User')
const Individual = require('./Individual')
const RArray = require('./RArray')

class Population {
  constructor(size, seed, probCross, probMuta) {
    // size shall be an integer to multiply allUsers by -- can elaborate on request
    this.seed = seed
    this.probCross = probCross
    this.probMuta = probMuta
    this.genNumber = 0
    this.dnaSize = 10
    this.currentPopulation = this.generate(size, seed)
    this.currentFitnesses = this.currentPopulation.map(individual =>
      individual.getFitness()
    )
  }

  generate(size, seed) {
    return new RArray(size)
      .fill(null)
      .map(() => new Individual(seed.getNRandomElements(this.dnaSize)))
  }

  // creates next generation for a population
  // updates currentPopulation, currentFitnesses, returns modified population object
  nextGeneration() {
    let nextPopulation = new RArray()

    while (nextPopulation.length < this.currentPopulation.length) {
      nextPopulation = nextPopulation.slice().concat(this.haveTwoChildren())
    }

    if (nextPopulation.length > this.currentPopulation.length)
      nextPopulation.splice(-1, 1)

    this.currentPopulation = nextPopulation
    this.currentFitnesses = nextPopulation.map(individual =>
      individual.getFitness()
    )

    return this
  }

  // from current population, roulette select 2 parents (indivs), create 2 Individuals
  // cross and mutate if probability dictates
  haveTwoChildren() {
    const mom1 = this.select(),
      mom2 = this.select()

    const possiblyCrossed =
      Math.random() < this.probCross
        ? this.crossover(mom1, mom2)
        : new RArray(mom1, mom2)

    const mutatedChildren = possiblyCrossed.map(individual =>
      individual.mutate(this.probMuta, this.seed)
    )

    return mutatedChildren
  }

  select() {
    const fitnessArr = this.currentFitnesses
    const fitnessSum = fitnessArr.reduce((sum, fitness) => sum + fitness, 0)
    let roll = Math.random() * fitnessSum

    for (let i = 0; i < this.currentPopulation.length; i++) {
      if (roll < fitnessArr[i]) {
        return this.currentPopulation[i]
      }

      roll -= fitnessArr[i]
    }
  }

  crossover(mom1, mom2) {
    let num1 = mom1.dna.getRandomIndex(),
      num2 = mom2.dna.getRandomIndex()

    const segmentStart = Math.min(num1, num2),
      segmentEnd = Math.max(num1, num2)

    const firstOffspring = twoPtCross(segmentStart, segmentEnd, mom1, mom2),
      secOffspring = twoPtCross(segmentStart, segmentEnd, mom2, mom1)
    return new RArray(
      new Individual(firstOffspring),
      new Individual(secOffspring)
    )
  }

  getFittest() {
    const fittestIndex = this.currentFitnesses.reduce(
      (fittestInd, currentScore, i, scores) => {
        if (currentScore > scores[fittestInd]) return i
        return fittestInd
      },
      0
    )

    return this.currentPopulation[fittestIndex]
  }
}

// just a naive two point cross https://en.wikipedia.org/wiki/Crossover_(genetic_algorithm)#Two-point_and_k-point_crossover
const twoPtCross = (start, end, segParent, otherParent) => {
  const childDNA = segParent.dna.slice(start, end)
  return otherParent.dna
    .slice(0, start)
    .concat(childDNA)
    .concat(otherParent.dna.slice(end))
}

module.exports = Population

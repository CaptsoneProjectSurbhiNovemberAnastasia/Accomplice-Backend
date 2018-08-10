const RArray = require('./RArray')
const DNA = require('./DNA')

module.exports = class Individual {
  // dna shall be an array of users, randomly selected out of all total users
  constructor(dna) {
    if (dna.length > 10) console.log(dna, dna.length)
    this.dna = new DNA(...dna)
  }

  getFitness() {
    const dnaCopy = this.dna.slice()
    let fitness = 0
    while (dnaCopy.length) {
      const userToCompare = dnaCopy.splice(0, 1)[0]
      fitness += userToCompare.getFitnessOfMatchWithAll(dnaCopy)
    }
    return 1 / fitness
  }

  mutate(p, genePool) {
    // p shall be the probability of mutation
    const mutatedUserSelection = this.dna.slice()
    for (let i = 0; i < mutatedUserSelection.length; i++) {
      if (Math.random() < p) {
        const randMatchIndex = mutatedUserSelection.getRandomIndex(),
          randUserIndex = genePool.getRandomIndex()

        const userToSwapIn = genePool[randUserIndex]
        this.dna[randMatchIndex] = userToSwapIn
      }
    }
    return new Individual(mutatedUserSelection)
  }
}

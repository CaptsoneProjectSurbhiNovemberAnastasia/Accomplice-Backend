import RArray from './RArray'
import DNA from './DNA'
import { allUsers } from 'main'

export default class Individual {
  // dna shall be an array of users, randomly selected from all total users
  constructor(dna) {
    // assume dna must be an instance of class DNA
    this.dna = dna
  }

  getFitness() {
    const dnaCopy = this.dna.slice()
    let fitness = 0
    while (dnaCopy.length) {
      const userToCompare = dnaCopy.splice(0, 1)[0]
      fitness += userToCompare.getFitnessOfMatchWithAll(dnaCopy)
    }
    return fitness
  }

  mutate(p) {
    // p shall be the probability of mutation
    const mutatedUserSelection = this.dna.slice()
    for (let i = 0; i < mutatedUserSelection.length; i++) {
      if (Math.random() < p) {
        const randMatchIndex = mutatedUserSelection.getRandomIndex(),
          randUserIndex = allUsers.getRandomIndex()

        const userToSwapIn = allUsers[randUserIndex]
        this.dna[randMatchIndex] = userToSwapIn
      }
    }
    return new Individual(mutatedUserSelection)
  }
}

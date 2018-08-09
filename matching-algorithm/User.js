export default class User {
  constructor(userFromDB) {
    this.traits = [...userFromDB.traits]
    this.id = userFromDB.id
  }

  /*

    traits: [
              {
                name: Extroversion
                value: 50 (from quiz)
                weight: 1 (change based on data)
              },
              {
                name: Emotional Stability
                value: 50 (from quiz)
                weight: 1 (change based on data)
              },
              {
                name: Agreeableness
                value: 50 (from quiz)
                weight: 1 (change based on data)
              },
              {
                name: Consciensciousness
                value: 50 (from quiz)
                weight: 1 (change based on data)
              },
              {
                name: Intellect
                value: 50 (from quiz)
                weight: 1 (change based on data)
              },
            ]

    */

  getFitnessOfMatchWith(otherUser) {
    return User.getMatchFitnessBetween(this, otherUser)
  }

  static getFitnessOfMatchBetween(userA, userB) {
    return userA.traits.reduce(
      (a, b, i) =>
        a +
        Math.abs(b.value - userB.traits[i].value) *
          b.weight *
          userB.traits[i].weight,
      0
    )
  }

  getFitnessOfMatchWithAll(otherUsers) {
    // otherUsers shall be an array of type DNA
    return otherUsers.reduce((a, b) => a + this.getFitnessOfMatchWith(b), 0)
  }
}

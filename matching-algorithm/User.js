module.exports = class User {
  constructor(userFromDB) {
    this.traits = [...userFromDB.traits]
    this.id = userFromDB.id
  }

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

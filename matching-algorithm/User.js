module.exports = class User {
  constructor(userFromDB) {
    // deal with awful eager loading structure
    this.traits = userFromDB.traits.map(trait => ({
      name: trait.name,
      weight: trait.user_trait.weight,
      value: trait.user_trait.value,
    }))
    this.id = userFromDB.id
  }

  getFitnessOfMatchWith(otherUser) {
    return User.getFitnessOfMatchBetween(this, otherUser)
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

  static areEqual(userA, userB) {
    return userA.id === userB.id
  }

  equals(otherUser) {
    return User.areEqual(this, otherUser)
  }
}

module.exports = class RArray extends Array {
  // no constructor--we want the default array constructor; we are only adding some convenient methods
  getRandomIndex() {
    return Math.floor(Math.random() * this.length)
  }

  getRandomElement() {
    return this[this.getRandomIndex()]
  }

  getNRandomElements(n) {
    const randomElements = new RArray()
    if (this.length < n) {
      return this
    } else {
      while (randomElements.length < n) {
        // uPush may not add to the length of randomElements, thus a while loop
        console.log(randomElements.length, n)
        randomElements.uPush(this.getRandomElement())
      }
      return randomElements
    }
  }

  // unique element addition
  uPush(ele) {
    return this.includes(ele) ? this : this.push(ele)
  }

  // unique array concatenation
  uConcat(rArray) {
    const toPush = rArray.slice()
    while (toPush.length) {
      this.uPush(toPush.splice(0, 1)[0])
    }
  }
}

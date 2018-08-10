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
    while (randomElements.length < n) {
      // uPush may not add to the length of randomElements, thus a while loop
      randomElements.uPush(this.getRandomElement())
    }
    return randomElements
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

// export const getNRandomValuesAndRemove = (arr, n) => {
//   if (arr.length < n) n = arr.length - 1
//   let nRandomValues = []
//   for (let i = 0; i < n; i++) {
//     const randIndex = getRandomIndex(arr)
//     array = array.splice(randIndex, 1)
//   }
//   return nRandomValues
// }

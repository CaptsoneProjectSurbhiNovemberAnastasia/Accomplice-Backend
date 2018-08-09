// const runNTimes = (f, n, ...args) => {
//   for (let i = 0; i < n; i++) {
//     f(...args)
//   }
// }

export default class RArray extends Array {
  // no constructor--we want the default array constructor; we are only adding some convenient methods
  getRandomIndex() {
    return Math.floor(Math.random() * this.length)
  }

  getRandomElement() {
    return this[this.getRandomIndex()]
  }

  getNRandomElements(n) {
    const randomElements = []
    for (let i = 0; i < n; i++) {
      randomElements.push(this.getRandomElement())
    }
    return randomElements
  }

  rotate(i) {
    const offset = this.length - i
    return new RArray(...this.slice(offset), ...this.slice(0, offset))
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

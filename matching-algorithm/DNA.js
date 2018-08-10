const RArray = require('./RArray')

const DNASize = 10

// May be redundant but may use later
module.exports = class DNA extends RArray {
  constructor(...args) {
    super(...args)
    if (args.length > 10) {
      throw new Error(
        `Instance of class DNA must not exceed length 10. Offending length was ${
          args.length
        }.`
      )
    }
  }
}

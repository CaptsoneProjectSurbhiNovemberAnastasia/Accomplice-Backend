const crypto = require('crypto')
const Sequelize = require('sequelize')
const db = require('../db')
const Trait = require('./trait')

const User = db.define(
  'user',
  {
    email: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
      isEmail: true,
    },
    password: {
      type: Sequelize.STRING,
      // Making `.password` act like a func hides it when serializing to JSON.
      // This is a hack to get around Sequelize's lack of a "private" option.
      get() {
        return () => this.getDataValue('password')
      },
    },
    firstName: {
      type: Sequelize.STRING,
      allowNull: true,
      // validate: {
      //   notEmpty: true,
      // },
    },
    lastName: {
      type: Sequelize.STRING,
      allowNull: true,
      // validate: {
      //   notEmpty: true,
      // },
    },
    salt: {
      type: Sequelize.TEXT,
      // Making `.salt` act like a function hides it when serializing to JSON.
      // This is a hack to get around Sequelize's lack of a "private" option.
      get() {
        return () => this.getDataValue('salt')
      },
    },
    facebookId: {
      type: Sequelize.STRING,
    },
    age: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    imageUrl: {
      type: Sequelize.TEXT,
      defaultValue: '#',
    },

    description: {
      type: Sequelize.TEXT,
      allowNull: true,
    },

    latitude: {
      type: Sequelize.FLOAT,
      allowNull: true,
      defaultValue: null,
      validate: { min: -90, max: 90 },
    },
    longitude: {
      type: Sequelize.FLOAT,
      allowNull: true,
      defaultValue: null,
      validate: { min: -180, max: 180 },
    },
  },
  {
    validate: {
      bothCoordsOrNone: function() {
        if ((this.latitude === null) !== (this.longitude === null)) {
          throw new Error(
            'Require either both latitude and longitude or neither'
          )
        }
      },
    },
  }
)

module.exports = User

/**
 * instanceMethods
 */
User.prototype.correctPassword = function(candidatePwd) {
  return User.encryptPassword(candidatePwd, this.salt()) === this.password()
}

User.prototype.getSanitizedDataValues = function() {
  const {
    description,
    imageUrl,
    age,
    lastName,
    firstName,
    id,
    latitude,
    longitude,
    email,
  } = this.dataValues
  return {
    description,
    imageUrl,
    age,
    lastName,
    firstName,
    id,
    latitude,
    longitude,
    email,
  }
}

User.prototype.encorporateIntoMatchPool = async function(matchPool) {
  try {
    const randomIndex = Math.floor(Math.random() * matchPool.length)
    await this.addSuggested_match(matchPool[randomIndex])
  } catch (e) {
    console.error(e)
  }
}

/**
 * classMethods
 */
User.generateSalt = function() {
  return crypto.randomBytes(16).toString('base64')
}

User.encryptPassword = function(plainText, salt) {
  return crypto
    .createHash('RSA-SHA256')
    .update(plainText)
    .update(salt)
    .digest('hex')
}

/**
 * hooks
 */

User.afterCreate(async user => {
  try {
    const traits = await Trait.findAll()
    for (let j = 0; j < traits.length; j++) {
      await user.addTrait(traits[j])
    }
  } catch (e) {
    console.error(e)
  }
})

const setSaltAndPassword = user => {
  if (user.changed('password')) {
    user.salt = User.generateSalt()
    user.password = User.encryptPassword(user.password(), user.salt())
  }
}

const matchWithTestUser = async user => {
  try {
    const testUser = await User.findById(1)
    await testUser.addMatched(user)
    await user.addMatched(testUser)
  } catch (e) {
    console.error(e)
  }
}

User.beforeCreate(setSaltAndPassword)
User.beforeUpdate(setSaltAndPassword)
User.afterCreate(matchWithTestUser)


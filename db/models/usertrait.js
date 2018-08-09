const crypto = require('crypto')
const Sequelize = require('sequelize')
const db = require('../db')

const UserTrait = db.define('usertrait', {
  weight: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
      max: 2
    }
  },
  value: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
      max: 10
    }
  }
})
module.exports = UserTrait

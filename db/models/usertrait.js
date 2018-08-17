const Sequelize = require('sequelize')
const db = require('../db')

const UserTrait = db.define('user_trait', {
  weight: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: {
      min: 0,
      max: 2,
    },
  },
  value: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
      max: 100,
    },
  },
})

module.exports = UserTrait

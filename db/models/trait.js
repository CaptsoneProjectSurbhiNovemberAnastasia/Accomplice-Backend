const crypto = require('crypto')
const Sequelize = require('sequelize')
const db = require('../db')

const Trait = db.define('trait', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  }
})
module.exports = Trait

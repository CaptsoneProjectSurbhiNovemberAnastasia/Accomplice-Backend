const Sequelize = require('sequelize')
const db = require('../db')

const SuggestedMatchesPerUser = db.define('SuggestedMatchesPerUser', {})

module.exports = SuggestedMatchesPerUser

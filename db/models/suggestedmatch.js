const Sequelize = require('sequelize')
const db = require('../db')

const SuggestedMatch = db.define('suggestedmatch', {})

module.exports = SuggestedMatch

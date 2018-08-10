const Sequelize = require('sequelize')
const db = require('../db')

const SuggestedMatch = db.define('suggested_match', {})

module.exports = SuggestedMatch

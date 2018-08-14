const Sequelize = require('sequelize')
const db = require('../db')

const SuggestedMatch = db.define('match', {})

module.exports = SuggestedMatch

const Sequelize = require('sequelize');
const db = require('../db');

const SuggestedMatches = db.define('suggestedmatches', {});

module.exports = SuggestedMatches;

'use strict';
var config = require('../config/config');
var mongoose = require('mongoose');

// Skill Schema
var SkillSchema = new mongoose.Schema({
	name: String,
	unlockLevel: Number,
	strengthFactor: Number,
	staminaFactor: Number,
	agilityFactor: Number
});

module.exports = mongoose.model('Skill', SkillSchema);

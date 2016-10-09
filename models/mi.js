'use strict';

// Module dependencies
var mongoose = require('mongoose');

// Define Mi schema
var MiSchema = new mongoose.Schema({
	name: { type: String, default: 'Mi' },
	age: { type: Number, default: 0 },
	hp: Number,
	xp: Number,
	level: Number,
	strength: Number,
	stamina: Number,
	agility: Number,
	mood: Number,
	goalDistance: Number,
	goalStep: Number,
	goalFlight: Number
});

// Export the Mongoose model
module.exports = mongoose.model('Mi', MiSchema);

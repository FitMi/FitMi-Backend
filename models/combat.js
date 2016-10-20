'use strict';
var config = require('../config/config');
var mongoose = require('mongoose');

// Combat Schema
var CombatSchema = new mongoose.Schema({
  timestamp: Date,
  fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
  },
  toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
  },
  fromUserStatus: {
    displayName: String,
    strength: Number,
    stamina: Number,
    health: Number,
    health_limit: Number,
    appearance: String,
    level: String,
    skills: [String]
  },
  toUserStatus: {
    displayName: String,
    strength: Number,
    stamina: Number,
    health: Number,
    health_limit: Number,
    appearance: String,
    level: String,
    skills: [String]
  },
  winner: String, // User _id
  moves: [{
      attackUser: String, // User _id
      skillId: String,
      defenceUser: String, // User _id
      damage: Number,
      healing: Number,
      nextMoveResumeTime: Number
  }]
});

module.exports = mongoose.model('Combat', CombatSchema);

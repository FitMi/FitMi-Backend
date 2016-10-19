'use strict';
var config = require('../config/config');
var mongoose = require('mongoose');

// Combat Schema
var CombatSchema = new mongoose.Schema({
  timestamp: Date,
  fromUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
  },
  toUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
  },
  winner: String,
  moves: [{
      attackUser: String,
      skillId: String,
      defenceUser: String,
      damage: Number,
      healing: Number,
      nextMoveResumeTime: Number
  }]
});

module.exports = mongoose.model('Combat', CombatSchema);

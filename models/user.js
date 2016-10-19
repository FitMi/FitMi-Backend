'use strict';
var jwt = require('jsonwebtoken');
var config = require('../config/config');
var mongoose = require('mongoose');

// User Schema
var UserSchema = new mongoose.Schema({
  username: String,
  spritename: String,
  facebookToken: String,
  facebookId: String,
  wechatToken: String,
  wechatId: String,
  strength: Number,
  stamina: Number,
  agility: Number,
  health: Number,
  experience: Number,
  level: Number,
  skillInUse: Number,
  updatedAt: Date,
  lastCombatTime: Date
});

UserSchema.methods.generateJwt = function() {
  var expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);
  var token = jwt.sign({
    _id: this._id,
    name: this.username,
    fbId: this.facebookId,
    exp: parseInt(expiry.getTime() / 1000)
  }, config.secret)
  return token;
};

module.exports = mongoose.model('User', UserSchema);

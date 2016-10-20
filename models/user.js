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
  createdAt: Date,
  lastCombatTime: Date
});

UserSchema.methods.generateJwt = function() {
  var expiry = new Date();
  expiry.setDate(expiry.getDate() + 30); // 30 days
  var token = jwt.sign({
    _id: this._id,
    name: this.username,
    fbId: this.facebookId,
    exp: parseInt(expiry.getTime() / 1000)
  }, config.secret)
  return token;
};

UserSchema.pre('save', function(next){
  var now = new Date();
  this.updatedAt = now;
  if ( !this.createdAt ) {
    this.createdAt = now;
  }
  next();
});

UserSchema.pre('update', function (next) {
   this.update({}, {
     updatedAt: Date.now()
   });
   next();
 });

UserSchema.pre('findOneAndUpdate', function (next) {
   this.update({}, {
     updatedAt: Date.now()
   });
   next();
 });

module.exports = mongoose.model('User', UserSchema);

'use strict';
var jwt = require('jsonwebtoken');
var config = require('../config/config');
var mongoose = require('mongoose');

// User Schema
var UserSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  facebookId: { type: String, default: '' },
  wechatId: { type: String, default: '' }
});

UserSchema.methods.generateJwt = function() {
  var expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);

  return jwt.sign({
    _id: this._id,
    name: this.name,
    fbId: this.facebookId,
    exp: parseInt(expiry.getTime() / 1000)
  }, config.secret);
};

module.exports = mongoose.model('User', UserSchema);

'use strict';

// Module dependencies
var mongoose = require('mongoose');

// User Schema
var UserSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  username: { type: String, default: '' },
  provider: { type: String, default: '' },
  facebook: {},
  wechat: {}
});


module.exports = mongoose.model('User', UserSchema);

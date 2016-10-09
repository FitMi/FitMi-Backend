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

UserSchema.statics.findOrCreate = function (filters, cb) {
  User = this;
  this.find(filters, function(err, results) {
    if(results.length == 0) {
      var newUser = new User({ provider: "Facebook" });
      newUser.facebook = filters.profile;
      newUser.save(function(err, doc) {
        cb(err, doc)
      });
    } else {
      cb(err, results[0]);
    }
  });
};

mongoose.model('User', UserSchema);

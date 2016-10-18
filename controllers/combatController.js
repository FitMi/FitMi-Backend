var jwt = require('jsonwebtoken');
var config = require('../config/config');
var mongoose = require('mongoose');
var User = mongoose.model('User');

function resError(res, err) {
  return res.status(500).json({
    message: err.message
  });
}
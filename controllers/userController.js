var jwt = require('jsonwebtoken');
var config = require('../config/config');
var mongoose = require('mongoose');
var User = mongoose.model('User');

exports.getUser = function(req, res) {
	console.log(req)
	User.findOne(
    {
      '_id': req.params.id
    }, function(err, user) {
      if (err) {
        return res.status(500).json({
          message: err.message
        });
      }
      if (!user) {
      	res.send({
					status: "error",
					error: "User doesn't exist"
				});
      } else {
        //found user. Return
        return res.json(user);
      }
  });
};

/*
exports.updateUser = function(req, res) {
	User.findOne(
    {
      '_id': req
    }, function(err, user) {
      if (err) {
        return res.status(500).json({
          message: err.message
        });
      }
      if (!user) {
      } else {
        //found user. Return
        return res.json(user.generateJwt());
      }
  });
}

exports.getFrineds = function(req, res) {
	User.findOne(
    {
      '_id': req
    }, function(err, user) {
      if (err) {
        return res.status(500).json({
          message: err.message
        });
      }
      if (!user) {
      } else {
        //found user. Return
        return res.json(user.generateJwt());
      }
  });
}
*/

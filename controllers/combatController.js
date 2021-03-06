var jwt = require('jsonwebtoken');
var config = require('../config/config');
var mongoose = require('mongoose');
var Combat = require('../models/combat');

exports.createCombat = function(req, res) {
	var newCombat = new Combat({
		timestamp: Date.now(),
		fromUserId: req.user._id,
		toUserId: req.body.combat.toUserId,
		fromUserStatus: req.body.combat.fromUserStatus,
		toUserStatus: req.body.combat.toUserStatus,
		winner: req.body.combat.winner,
		moves: req.body.combat.moves
	});
  var promise = newCombat.save()
  promise
  .then(function(combat) {
    return res.json(combat);
  })
  .catch(function(error) {
  	console.log(error)
    return res.status(500).json({
      message: error.message
    });
  });
}

exports.getCombat = function(req, res) {
	Combat.findOne(
    {
      '_id': req.params.id
    }, function(err, combat) {
      if (err) {
        return res.status(500).json({
          message: err.message
        });
      }
      if (!combat) {
      	res.status(400).end({
					status: "error",
					error: "Combat doesn't exist"
				});
      } else {
        return res.json(combat);
      }
  });
};

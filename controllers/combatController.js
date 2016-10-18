var jwt = require('jsonwebtoken');
var config = require('../config/config');
var mongoose = require('mongoose');
var Combat = mongoose.model('Combat');

/*
exports.createCombat = function(req, res) {
	var newCombat = new Combat({
  });
  var promise = newCombat.save()
  promise
  .then(function(combat) {
    return res.json();
  })
  .catch(function(error) {
    return res.status(500).json({
      message: error.message
    });
  });
}
*/

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
      	res.send({
					status: "error",
					error: "Combat doesn't exist"
				});
      } else {
        return res.json(combat);
      }
  });
};

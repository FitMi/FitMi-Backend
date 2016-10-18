var jwt = require('jsonwebtoken');
var config = require('../config/config');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var graph = require('fbgraph');

exports.getUser = function(req, res) {
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

exports.updateUser = function(req, res) {
	var query = { '_id': req.params.id };
	User.findOneAndUpdate(query, req.body.newData, { upsert:true }, function(err, user) {
	    if (err) {
	    	return res.status(500).json({
         	message: err.message
        })
	    }
	    res.send({
				status: "ok",
			});
	});
}

exports.getFriends = function(req, res) {
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
      	console.log(user.facebookToken)
      	graph.setAccessToken(user.facebookToken);
        graph.batch([
				  {
				    method: "GET",
				    relative_url: "me/friends"
				  }
				], function(err, graphRes) {
				  console.log(graphRes);
				  if (err) {
        		return res.status(500).json({
          		message: err.message
        		})
        	}
        	res.send({
						status: "ok",
					});
				});
      }
  	}
  );
};

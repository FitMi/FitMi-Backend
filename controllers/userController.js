var jwt = require('jsonwebtoken');
var config = require('../config/config');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var graph = require('fbgraph');

exports.getUser = function(req, res) {
	User.findOne(
		{
			'facebookId': req.params.id
		},
    '_id facebookId level health health_limit agility appearance strength spritename stamina skillInUse',
    function(err, user) {
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
	var query = { '_id': req.user._id };
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
  User.findOne({
    '_id': req.user._id
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
      graph.setAccessToken(user.facebookToken);
      graph.batch([{
        method: "GET",
        relative_url: "me/friends"
      }], function(err, graphRes) {
        if (err) {
          if (err.code === 190) {
            // Need to re-authorize
            return res.status(401).json({
              message: 'Facebook Token Expired'
            })
          }
          return res.status(500).json({
            message: err.message
          })
        }
        friends = JSON.parse(graphRes[0].body).data;
        let friendIdList = friends.map(f => f.id);
        friendIdList.push('1214067008652251');
        // Try get all existing users that is friend of the requested user.
        var query = User.find({
          facebookId: {
            $in: friendIdList
          }
        }).select('_id username facebookId level');
        query.exec(function(err, users) {
          if (err) {
            return res.status(500).json({
              message: err.message
            });
          }
          return res.json(users);
        });
      });
    }
  });
};

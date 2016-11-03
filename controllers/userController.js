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
    '_id username facebookId level health agility appearance strength spritename stamina skillInUse experience healthLimit',
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

exports.updateUserSpritename = function(req, res) {
  var query = { '_id': req.user._id };
  if (!req.body.spritename) {
    res.send({
      status: "error",
      error: "Please input new spritename for update"
    });
  }
  var updateAttributes = { "spritename":req.body.spritename }
  User.findOneAndUpdate(query, updateAttributes, { upsert:true }, function(err, user) {
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

//(strength, stamina, agility, health, healthLimit)
exports.updateUserAttributes = function(req, res) {
  var query = { '_id': req.user._id };
  var updateAttributes = {}
  if (req.body.strength) {
    updateAttributes['strength'] = req.body.strength
  }
  if (req.body.stamina) {
    updateAttributes['stamina'] = req.body.stamina
  }
  if (req.body.agility) {
    updateAttributes['agility'] = req.body.agility
  }
  if (req.body.health) {
    updateAttributes['health'] = req.body.health
  }
  if (req.body.healthLimit) {
    updateAttributes['healthLimit'] = req.body.healthLimit
  }
  if (!updateAttributes.strength && !updateAttributes.stamina && !updateAttributes.agility && !updateAttributes.health && !updateAttributes.healthLimit) {
    res.send({
      status: "error",
      error: "Please input attributes for update"
    });
  }

  User.findOneAndUpdate(query, updateAttributes, { upsert:true }, function(err, user) {
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

exports.updateUserSkills = function(req, res) {
  var query = { '_id': req.user._id };
  if (!req.body.skills) {
    res.send({
      status: "error",
      error: "Please input skills in used for update"
    });
  }
  var updateAttributes = { "skillInUse":req.body.skills }
  User.findOneAndUpdate(query, updateAttributes, { upsert:true }, function(err, user) {
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

exports.updateUserAppearance = function(req, res) {
  var query = { '_id': req.user._id };
  if (!req.body.appearance) {
    res.send({
      status: "error",
      error: "Please input appearance for update"
    });
  }
  var updateAttributes = { "appearance":req.body.appearance }
  User.findOneAndUpdate(query, updateAttributes, { upsert:true }, function(err, user) {
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

exports.updateUserLevelExperience = function(req, res) {
  var query = { '_id': req.user._id };
  var updateAttributes = {}
  if (req.body.level) {
    updateAttributes['level'] = req.body.level
  }
  if (req.body.experience) {
    updateAttributes['experience'] = req.body.experience
  }
  if (!updateAttributes.level && !updateAttributes.experience) {
    res.send({
      status: "error",
      error: "Please input level / experience for update"
    });
  }

  User.findOneAndUpdate(query, updateAttributes, { upsert:true }, function(err, user) {
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

var jwt = require('jsonwebtoken');
var config = require('../config/config');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var graph = require('fbgraph');

exports.getUser = function(req, res) {
	User.findOne(
		{
			'facebookId': req.params.id
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
	User.findOne(
		{
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
				graph.batch([
					{
						method: "GET",
						relative_url: "me/friends"
					}
				], function(err, graphRes) {
					if (err) {
						return res.status(500).json({
							message: err.message
						})
					}
					friends = JSON.parse(graphRes[0].body).data;
					friends.push({"name": 'JoJo', id: '1843175555914388'});
					console.log(friends);
					var query = User.find({}).select('facebookId level');
					query.exec(function (err, users) {
						if (!err){ 
							var friendExist = false;
							for (var i = friends.length - 1; i >= 0; i--) {
								friendExist = false;
								for (var j = users.length - 1; j >= 0; j--) {
									if (users[j].facebookId == friends[i].id) {
										friendExist = true;
										friends[i].level = users[j].level;
										break;
									}
								};
								if (!friendExist) {
									friends.splice(i, 1);
									console.log(friends);
								}
							};
							return res.json(friends);
						} else {
							return res.status(500).json({
								message: err.message
							});
						}
					});
				});
			}
		}
	);
};

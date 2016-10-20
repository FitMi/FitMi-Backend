var graph = require('fbgraph');
var User = require('../models/user');
var jwt = require('jsonwebtoken');
var config = require('../config/config');

exports.authenticate = function (req, res) {
  if (!req.body.token) {
    return res.status(400).json({
      message: 'Invalid authenticate data.'
    });
  }
  var facebookToken = req.body.token;
  graph.get("/me?fields=name,id,email&access_token=" + facebookToken, function (error, response) {
    if (error) {
      return res.status(400).json({
        message: error.message
      });
    }

    User.findOne(
      {
        'facebookId': response.id
      }, function(err, user) {
        if (err) {
          return res.status(500).json({
            message: err.message
          });
        }
        //No user was found... so create a new user with values from Facebook (all the profile. stuff)
        if (!user) {
          var newUser = new User({
            username: response.name,
            facebookToken: facebookToken,
            facebookId: response.id
          });
          var promise = newUser.save()
          promise
          .then(function(user) {
            return res.json(user.generateJwt());
          })
          .catch(function(error) {
            return res.status(500).json({
              message: error.message
            });
          });
        } else {
          user.facebookToken = facebookToken; // update token
          user.save().then(function() {
            res.json(user.generateJwt());
          });
        }
    });
  });
}

exports.refreshToken = function(req, res, next) {
  let optionKeys = ['iat', 'exp', 'iss', 'sub'];
  let obj = {};
  let user = req.user;
  let now = Math.floor(Date.now() / 1000);

  let timeToExpire = (user['exp'] - now);

  if (timeToExpire < (302400)) { // 7 day
    for (let key in user) {
      if (optionKeys.indexOf(key) === -1) {
        obj[key] = user[key];
      }
    }

    let options = {
      expiresIn: '30d'
    };
    res.set('New-Token', jwt.sign(obj, config.secret, options));
  }

  next();
};

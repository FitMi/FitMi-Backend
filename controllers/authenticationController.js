var graph = require('fbgraph');
var User = require('../models/user');

exports.authenticate = function (req, res) {
  console.log(req.body)
  
  if (!req.body.token) {
    return res.status(400).json({
      message: 'Invalid authenticate data.'
    });
  }
  var facebookToken = req.body.token;
  console.log(facebookToken)
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
            name: response.name,
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
          //found user. Return
          return res.json(user.generateJwt());
        }
    });
  });
}

'use strict';

var users = require('../controllers/userController');
require('dotenv').config();

// var mi = require('../controllers/mis');
module.exports = function (app, passport, mongoose) {
  var User = mongoose.model('User');
  var FacebookStrategy = require('passport-facebook').Strategy;
  var options = {
    clientID: process.env.FACEBOOK_CLIENTID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: 'http://localhost:3000/auth/facebook/callback'
  };

  passport.use(
    new FacebookStrategy(
      options,
      function(accessToken, refreshToken, profile, done) {
        User.findOne({
            'facebook': profile._json
        }, function(err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                user = new User({
                    name: profile.displayName,
                    username: profile.username,
                    provider: 'facebook',
                    facebook: profile._json
                });
                user.save(function(err) {
                    if (err) console.log(err);
                    return done(err, user);
                });
            } else {
                //found user. Return
                return done(err, user);
            }
        });
      }
    )
  );
  
  app.get(
    '/auth/facebook',
    passport.authenticate('facebook', { session: false, scope: [] })
  );

  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { session: false, failureRedirect: "/" }),
    function(req, res) {
      res.redirect("/profile?access_token=" + req.user.access_token);
    }
  );
  
  app.get('/', function(req, res) {
        res.send('<a href="/auth/facebook">Log in</a>');
    }
  );

  app.get('/ping', function(req, res) {
    res.send('pong');
  });
};

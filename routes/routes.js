'use strict';

var users = require('../controllers/userController');
// var mi = require('../controllers/mis');
module.exports = function (app, passport, mongoose) {
  var User = mongoose.model('User');
  var FacebookStrategy = require('passport-facebook').Strategy;
  var options = {
    clientID: '1768015020120341',
    clientSecret: '65bc3ea9e559247fab5544eb6eb5b191',
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

  /**
   * Error handling
   */
  app.use(function (err, req, res, next) {
    // treat as 404
    if (err.message
      && (~err.message.indexOf('not found')
      || (~err.message.indexOf('Cast to ObjectId failed')))) {
      return next();
    }

    console.error(err.stack);

    if (err.stack.includes('ValidationError')) {
      res.status(422).render('422', { error: err.stack });
      return;
    }

    // error page
    res.status(500).render('500', { error: err.stack });
  });

  // assume 404 since no middleware responded
  app.use(function (req, res) {
    var payload = {
      url: req.originalUrl,
      error: 'Not found'
    };
    if (req.accepts('json')) return res.status(404).json(payload);
    res.status(404).render('404', payload);
  });
};

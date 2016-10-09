var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var config = require('./config/config');
var api = require('./routes/api');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', api);

// Connect to the beerlocker MongoDB
mongoose.connect('mongodb://localhost:27017/FitMe');

////////////
  var User = mongoose.model('User');
  var passport = require('passport');
  var FacebookStrategy = require('passport-facebook').Strategy
  options = {
    clientID: '1768015020120341',
    clientSecret: '65bc3ea9e559247fab5544eb6eb5b191',
    callbackURL: 'http://localhost:3000/auth/facebook/callback'
  };
  passport.use(
    new FacebookStrategy(
      options,
      function(accessToken, refreshToken, profile, done) {
        User.findOrCreate(
          { facebook: profile },
          function (err, result) {
            if(result) {
              result.access_token = accessToken;
              result.facebook = profile
              result.save(function(err, doc) {
              done(err, doc);
            });
          } else {
            done(err, result);
          }
         }
        );
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
////////////

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;

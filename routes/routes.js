var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var config = require('../config/config');
// var models  = require('../models');
var authCtrl = require('../controllers/authenticationController');
var userCtrl = require('../controllers/userController');

// Set up token authenticate
var verifyToken = jwt({secret: config.secret});

router.get('/', function(req, res) {
  res.json({
    status: 'ok'
  });
});

// Authenticate with Facebook access token
router.post('/authenticate', authCtrl.authenticate);

// Verify JSWT
router.get('/me', verifyToken, function(req, res) {
  res.send(req.user);
});

module.exports = router;
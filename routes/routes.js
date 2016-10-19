var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var config = require('../config/config');
// var models  = require('../models');
var authCtrl = require('../controllers/authenticationController');
var userCtrl = require('../controllers/userController');
var combatCtrl = require('../controllers/combatController');

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

// Get user
router.get('/users/:id', verifyToken, userCtrl.getUser);
// Update user
router.post('/users/:id', verifyToken, userCtrl.updateUser);
// Get friends
router.get('/users/:id/friends', verifyToken, userCtrl.getFriends);
// Add combat
router.post('/combat/create', verifyToken, combatCtrl.createCombat);
// Get combat
router.get('/combat/:id', verifyToken, combatCtrl.getCombat);

module.exports = router;

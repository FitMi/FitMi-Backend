var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var config = require('../config/config');
var authCtrl = require('../controllers/authenticationController');
var userCtrl = require('../controllers/userController');
var combatCtrl = require('../controllers/combatController');
var skillCtrl = require('../controllers/skillController');

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

// Get friends
router.get('/users/friends', verifyToken, userCtrl.getFriends);
// Get user
router.get('/users/:id', verifyToken, userCtrl.getUser);
// Update user
router.post('/users', verifyToken, userCtrl.updateUser);
// Add combat
router.post('/combats/create', verifyToken, combatCtrl.createCombat);
// Get combat
router.get('/combats/:id', verifyToken, combatCtrl.getCombat);
// Add combat
router.post('/skills/create', verifyToken, skillCtrl.createSkill);

module.exports = router;

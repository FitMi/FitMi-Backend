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
router.get('/me', verifyToken, authCtrl.refreshToken, function(req, res) {
  res.send(req.user);
});

// Get friends
router.get('/users/friends', verifyToken, authCtrl.refreshToken, userCtrl.getFriends);
// Get user
router.get('/users/:id', verifyToken, authCtrl.refreshToken, userCtrl.getUser);
// Update user
router.post('/users', verifyToken, authCtrl.refreshToken, userCtrl.updateUser);
// Add combat
router.post('/combats/create', verifyToken, authCtrl.refreshToken, combatCtrl.createCombat);
// Get combat
router.get('/combats/:id', verifyToken, authCtrl.refreshToken, combatCtrl.getCombat);
// Add combat
router.post('/skills/create', verifyToken, authCtrl.refreshToken, skillCtrl.createSkill);
// Add combat
router.get('/skills/:id', verifyToken, authCtrl.refreshToken, skillCtrl.getSkill);

module.exports = router;

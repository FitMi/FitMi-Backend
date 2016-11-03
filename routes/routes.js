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
// Update user spritename
router.post('/users/spritename', verifyToken, authCtrl.refreshToken, userCtrl.updateUserSpritename);
// Update user mi attributes (strength, stamina, agility, health, healthLimit)
router.post('/users/attributes', verifyToken, authCtrl.refreshToken, userCtrl.updateUserAttributes);
// Update user skills is used in use
router.post('/users/skills', verifyToken, authCtrl.refreshToken, userCtrl.updateUserSkills);
// Update user appearance
router.post('/users/appearance', verifyToken, authCtrl.refreshToken, userCtrl.updateUserAppearance);
// Update user level and experience
router.post('/users/level_experience', verifyToken, authCtrl.refreshToken, userCtrl.updateUserLevelExperience);
// Add combat
router.post('/combats/create', verifyToken, authCtrl.refreshToken, combatCtrl.createCombat);
// Get combat
router.get('/combats/:id', verifyToken, authCtrl.refreshToken, combatCtrl.getCombat);

module.exports = router;

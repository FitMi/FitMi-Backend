var express = require('express');
var router = express.Router();
var config = require('../config/config');
var Mi = require('../models/mi');
var User = require('../models/user');

router.get('/ping', function(req, res) {
  res.send('pong');
});

module.exports = router;

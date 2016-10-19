var jwt = require('jsonwebtoken');
var config = require('../config/config');
var mongoose = require('mongoose');
var Skill = require('../models/skill');

exports.createSkill = function(req, res) {
  var newSkill = new Skill(req.body.skill);
  var promise = newSkill.save()
  promise
  .then(function(skill) {
    return res.json(skill);
  })
  .catch(function(error) {
    return res.status(500).json({
      message: error.message
    });
  });
}

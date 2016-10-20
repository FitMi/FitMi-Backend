var jwt = require('jsonwebtoken');
var config = require('../config/config');
var mongoose = require('mongoose');
var Skill = require('../models/skill');

exports.createSkill = function(req, res) {
  var newSkill = new Skill({
    name: req.body.skill.name,
    strengthFactor: req.body.skill.strengthFactor,
    staminaFactor: req.body.skill.staminaFactor,
    agilityFactor: req.body.skill.agilityFactor
  });
  var promise = newSkill.save()
  promise
  .then(function(skill) {
    return res.json(skill);
  })
  .catch(function(error) {
    console.log(error)
    return res.status(500).json({
      message: error.message
    });
  });
}

exports.getSkill = function(req, res) {
  Skill.findOne(
    {
      '_id': req.params.id
    }, function(err, skill) {
      if (err) {
        return res.status(500).json({
          message: err.message
        });
      }
      if (!skill) {
        res.send({
          status: "error",
          error: "Skill doesn't exist"
        });
      } else {
        //found user. Return
        return res.json(skill);
      }
  });
}

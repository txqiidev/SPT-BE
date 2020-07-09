const Joi = require("joi");

function validateRegistration(user) {
  const schema = {
    firstname: Joi.string().min(1).max(45),
    lastname: Joi.string().min(1).max(45).required(),
    isAdmin: Joi.required(),
    email: Joi.string().min(5).max(255).required(),
    password: Joi.string().min(5).max(255).required(),
  };
  return Joi.validate(user, schema);
}

function validateAuthentication(user) {
  const schema = {
    email: Joi.string().min(5).max(255).required(),
    password: Joi.string().min(5).max(255).required(),
  };
  return Joi.validate(user, schema);
}

exports.validate = { validateRegistration, validateAuthentication };

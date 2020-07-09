const Joi = require("joi");

function validateURL(module) {
  const schema = {
    id: Joi.string().required(),
    url: Joi.string().uri().required(),
  };
  return Joi.validate(module, schema);
}

function validatePrerequisite(module) {
  const schema = {
    id: Joi.string().required(),
    idPrerequisite: Joi.string().required(),
  };
  return Joi.validate(module, schema);
}

function validateHasPrerequisite(module) {
  const schema = {
    id: Joi.string().required(),
    hasPrerequisite: Joi.required(),
  };
  return Joi.validate(module, schema);
}

exports.validate = {
  validateURL,
  validateHasPrerequisite,
  validatePrerequisite,
};

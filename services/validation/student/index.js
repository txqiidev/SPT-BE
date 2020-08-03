const Joi = require("joi");

function validatePlan(module) {
  const schema = {
    email: Joi.string().min(5).max(255).required(),
    idSemester: Joi.number().integer().min(1).max(12).required(),
    idModule: Joi.string(),
  };
  return Joi.validate(module, schema);
}

exports.validate = {
  validatePlan,
};

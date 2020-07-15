const Joi = require("joi");

function validatePlan(module) {
  const schema = {
    email: Joi.string().min(5).max(255).required(),
    idSemester: Joi.number().required(),
    idModule: Joi.string().required(),
  };
  return Joi.validate(module, schema);
}

exports.validate = {
  validatePlan,
};

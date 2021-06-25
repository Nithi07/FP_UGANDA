const Joi = require('joi');

const constants = require('../constants');

const { NAME_MIN, NAME_MAX, PASSWORD_MATCH, Mobile_MIN ,Mobile_MIN_ERROR,Mobile_MAX_ERROR} = constants;

const schema = Joi.object().keys({
  name: Joi.string()
    .min(NAME_MIN)
    .max(NAME_MAX)
    .required(),
  lname:Joi.any(),
  mobile_no:Joi.number().required(),
  mobile_no1:Joi.number().required(),
  username:Joi.any(),
  password: Joi.any().required(),
  con_password: Joi.any().required().valid(Joi.ref('password')).options({ language: { any: { allowOnly: 'must match password' } } }),
  email: Joi.string().email({ minDomainAtoms: 2 }),
}).with('password', 'con_password');

async function validateRegisterPayload(req, res, next) {
  let payloadValidation;
  try {
    payloadValidation = await Joi.validate(req.body, schema, { abortEarly: false });
  } catch (validateRegisterError) {
    payloadValidation = validateRegisterError;
  }
  const { details } = payloadValidation;
  let errors;
  if (details) {
    errors = {};
    details.forEach(errorDetail => {
      const {
        path: [key],
        type,
      } = errorDetail;
      const errorType = type.split('.')[1];
      if(key =='con_password'){
        errors[key] = PASSWORD_MATCH;
      }else if(key == 'mobile_no'){
        errors[key] = Mobile_MIN_ERROR;
      }else{
        errors[key] = constants[`${key.toUpperCase()}_${errorType.toUpperCase()}_ERROR`];
      }
    });
  }

  if (errors) {
    req.session.messages = { errors };
    return res.status(400).redirect('/register');
  }
  return next();
}

module.exports = validateRegisterPayload;

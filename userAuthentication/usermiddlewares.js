const joi = require("joi");

const validateUser = async (req, res, next) => {
  try {
    const UserSchema = joi.object({
      firstname: joi.string().required(),
      lastname: joi.string().required(),
      username: joi.string().required(),
      email: joi.string().email().required(),
      password: joi.string().min(3).required(),
      // country: joi.string().required(),
      // gender: joi.string().valid("male", "female").required(),
    });

    await UserSchema.validateAsync(req.body, { abortEarly: false });

    next();
  } catch (error) {
    console.log(error);
    res.status(422).json({
      message: "",
      success: false,
    });
  }
};

const loginValidate = async (req, res, next) => {
  try {
    const schema = joi.object({
      email: joi.string().email().required(),
      password: joi.string().required(),
    });
    await schema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    return res.status(422).json({
      message: error.message,
      success: false,
    });
  }
};

module.exports = { validateUser, loginValidate };

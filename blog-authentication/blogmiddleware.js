const joi = require("joi");

const validateBlog = async (req, res, next) => {
  try {
    const blogSchema = joi.object({
      title: joi.string().required(),
      description: joi.string().required(),
      tags: joi.array(),
      body: joi.string().required(),
      author: joi.string().required(),
    });

    await blogSchema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    console.log(error);
    res.status(422).json({
      message: "An error occured",
      success: false,
    });
  }
};

module.exports = { validateBlog };

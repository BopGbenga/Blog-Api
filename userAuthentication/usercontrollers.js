const userModel = require("../models/usermodels");
const jwt = require("jsonwebtoken");
const logger = require("../logger/loger");

require("dotenv").config();

//creating a new user
const createUser = async (req, res) => {
  logger.info("creating of user started");
  const userInfo = req.body;

  //check if user exist
  const existingUser = await userModel.findOne({ email: userInfo.email });
  if (existingUser) {
    return res.status(409).json({
      message: "user already exist",
      success: false,
    });
  }

  //create user
  const newUser = await userModel.create(userInfo);

  logger.info("user creation ended");
  res.status(201).json({
    message: "user created successfully ",
    newUser,
  });
};

//user login
const login = async (req, res) => {
  logger.info("login user started");
  const logInfo = req.body;

  const user = await userModel.findOne({ email: logInfo.email });
  if (!user) {
    return res.status(409).json({
      message: "user not found",
      success: false,
    });
  }

  const validPassword = await user.isValidPassword(logInfo.password);
  console.log(validPassword);
  if (!validPassword) {
    return res.status(422).json({
      message: "email or password is incorrect",
    });
  }

  const token = jwt.sign(
    { _id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
  logger.info("login user ended");
  return res.status(200).json({
    message: "login successfully",
    success: true,
    token,
  });
};

module.exports = { createUser, login };

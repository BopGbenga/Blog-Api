const jwt = require("jsonwebtoken");

const userModel = require("./models/usermodels");

require("dotenv").config();

const bearTokenAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        message: "you are not authorized",
      });
    }
    const token = await authHeader.split(" ")[1];

    // console.log(authHeader);

    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    // console.log({ decoded });
    const user = await userModel.findOne({ _id: decoded._id });

    if (!user) {
      return res.status(401).json({
        message: "not found",
      });
    }
    req.user = user;

    // console.log(user);

    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
};

module.exports = { bearTokenAuth };

const express = require("express");
const controller = require("./usercontrollers");
const middleware = require("./usermiddlewares");
const cookieparser = require("cookie-parser");

const router = express.Router();
router.use(cookieparser());

router.post("/signup", middleware.validateUser, controller.createUser);

router.post("/login", middleware.loginValidate, controller.login);

module.exports = router;

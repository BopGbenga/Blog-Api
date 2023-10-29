const express = require("express");
const middleware = require("./blogmiddleware");
const controller = require("./blogcontrollers");
const tokenAuth = require("../auth");

const router = express.Router();

router.post(
  "/post",
  middleware.validateBlog,
  tokenAuth.bearTokenAuth,
  controller.createBlog
);
router.get("/get", controller.getAllBlogs);

router.get("/authorsBlogs", tokenAuth.bearTokenAuth, controller.authorsBlogs);

router.get("/get/:blogId", tokenAuth.bearTokenAuth, controller.getBlogbyId);

router.put("/update/:blogId", tokenAuth.bearTokenAuth, controller.UpdateBlog); // p

router.put("/update/:blogId", tokenAuth.bearTokenAuth, controller.editBlog); //

router.delete(
  "/delete/:blogId",
  tokenAuth.bearTokenAuth,
  controller.deleteBlog
);

module.exports = router;

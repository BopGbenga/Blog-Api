const blogModel = require("../models/blogModels");
const mongoosePaginate = require("mongoose-paginate-v2");
const logger = require("../logger/loger");

require("dotenv").config();

// create blog

const createBlog = async (req, res) => {
  logger.info("creation of blogs started");
  try {
    const blog = req.body;
    const { _id, firstname, lastname } = req.user;

    const author = `${firstname} ${lastname}`;

    const wpm = 225; //wpm => word per minute
    const numberOfWords = blog.body.trim().split(/\s+/).length;
    const readTime = Math.ceil(numberOfWords / wpm);

    blog.author = author;
    blog.authorId = _id;
    blog.readTime = `${readTime} mins`;

    const newBlog = await blogModel.create(blog);

    logger.info("creation of blog ended");
    return res.status(200).json({
      message: "blog created successfully",
      success: true,
      newBlog,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ status: false, message: error.message });
  }
};

// Get all blogs
const getAllBlogs = async (req, res) => {
  logger.info("getting  of blogs started");
  try {
    const { page = 1, limit = 20, tags, title, author, sort } = req.query;

    const query = { state: "published" };

    if (tags) {
      query.tags = tags;
    }

    if (author) {
      query.author = author;
    }
    if (title) {
      query.title = title;
    }

    const options = {
      page: page,
      limit: limit,
    };
    if (sort) {
      if (["read_count", "reading_time", "timestamp"].includes(sort)) {
        options.sort = `-${sort}`;
      }
    }

    // Use Mongoose's paginate method to fetch paginated blogs
    const blogs = await blogModel.paginate(query, options);

    if (blogs.docs.length === 0) {
      return res.status(404).json({
        message: "No blogs found.",
      });
    }
    logger.info("getting of blog ended");
    return res.status(200).json({
      message: `Blogs successfully retrieved`,
      data: blogs.docs,
      page: blogs.page,
      totalPages: blogs.pages,
    });
  } catch (error) {
    // Handle errors appropriately
    logger.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

//Get blog by Id

const getBlogbyId = async (req, res) => {
  logger.info("getting  of blogs by id started");
  try {
    const blogId = req.params.blogId;

    console.log(blogId);

    const blog = await blogModel.findById(blogId);
    if (!blog) {
      // console.log(blog);

      return res.status(404).json({
        message: "Blog with the Id not found",
        success: false,
      });
    }
    blog.readcount === 0 ? blog.readcount++ : blog.readcount++;

    const author = await blogModel.findOne({});

    await blog.save();
    logger.info("getting of blogs ended");
    return res.status(200).json({
      blog,
      author,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      message: "An error occured",
    });
  }
};

// updateBlog to publish
const UpdateBlog = async (req, res) => {
  logger.info("updating of blogs started");
  try {
    const blogId = req.params.blogId;
    const userId = req.user._id;

    const blog = await blogModel.findById(blogId);
    if (!blog) {
      return res.status(404).json({
        message: "blog not found",
        success: false,
      });
    }

    // check if the user is the owner of the blog

    if (blog.authorId.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "You are not authorized to update this blog",
        success: false,
      });
    }

    blog.state = "published";
    await blog.save();
    logger.info("updating of blogs ended");
    return res.status(200).json({
      message: "Blog state successfully updated",
      success: true,
      blog,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      message: "An error occured",
      success: false,
    });
  }
};

// updateblog
const editBlog = async (req, res) => {
  logger.info("updating of blogs started");
  try {
    const blogId = req.params.blogId;
    const userId = req.user._id;
    const updatedBlogData = req.body;

    const blog = await blogModel.findById(blogId);
    if (!blog) {
      return res.status(404).json({
        message: "blog not found",
        success: false,
      });
    }

    // check if the user is the owner of the blog

    if (blog.authorId.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "You are not authorized to update this blog",
        success: false,
      });
    }
    blog.title = updatedBlogData;
    blog.description = updatedBlogData;
    blog.body = updatedBlogData;

    await blog.save();
    logger.info("updating of blogs ended");
    return res.status(200).json({
      message: "Blog state successfully updated",
      success: true,
      blog,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      message: "An error occured",
      success: false,
    });
  }
};

const authorsBlogs = async (req, res) => {
  logger.info("gettting of authorsBlogs started");
  try {
    const userId = req.user._id;
    const { page = 1, limit = 3, state } = req.query;

    const query = { authorId: userId };
    console.log(userId);

    if (state) {
      query.state = state;
    }

    const options = {
      page: page,
      limit: limit,
    };

    const blogs = await blogModel.paginate(query, options);

    if (blogs.docs.length === 0) {
      return res.status(404).json({
        message: " no blogs found",
      });
    }
    logger.info("getting of authorsBlogs ended ");
    return res.status(200).json({
      message: "blogs retrieved succesfully",
      data: blogs.docs,
      page: blogs.page,
      totalPages: blogs.pages,
      success: true,
    });
  } catch (error) {
    logger.errror(error);
    res.status(500).json({
      message: "An error occured",
      success: false,
    });
  }
};

const deleteBlog = async (req, res) => {
  logger.info("delete blog started ");
  try {
    const blogId = req.params.blogId;

    const blog = await blogModel.findById(blogId);
    if (!blog) {
      return res.status(404).json({
        message: "blog not found",
        success: false,
      });
    }

    if (blog.authorId.toString() === req.user._id.toString()) {
      await blog.deleteOne();
      logger.info("delete blogs ended");
      return res.status(200).json({
        message: `blog  deleted `,
      });
    } else {
      return res.status(403).json({
        message: `Unauthorized`,
      });
    }
  } catch (error) {
    logger.error(error);
  }
};

module.exports = {
  createBlog,
  getAllBlogs,
  getBlogbyId,
  UpdateBlog,
  authorsBlogs,
  editBlog,
  deleteBlog,
};

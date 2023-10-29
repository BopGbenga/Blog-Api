const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2");

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "A blog must have a title"],
    unique: true,
  },
  description: {
    type: String,
    unique: true,
  },
  author: {
    type: String,
    required: true,
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  tags: [String],
  readcount: {
    type: Number,
    default: 0,
  },
  timeStamp: {
    type: Date,
    default: Date.now,
  },
  readTime: {
    type: String,
  },

  state: {
    type: String,
    enum: ["draft", "published"],
    default: "draft",
  },
  body: {
    type: String,
    required: [true, "A post must contain a body "],
  },
});

blogSchema.plugin(mongoosePaginate);

const userModel = mongoose.model("Blog", blogSchema);

module.exports = userModel;

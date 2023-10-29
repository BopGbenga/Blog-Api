const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
    allownull: false,
  },
  lastname: {
    type: String,
    required: true,
    allownull: false,
  },
  username: {
    type: String,
    required: true,
    allownull: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    allownull: false,
  },
  gender: {
    type: String,
    enum: ["male", "female"],
  },
});

userSchema.pre("save", async function (next) {
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
  next();
});

userSchema.methods.isValidPassword = async function (password) {
  const user = this;
  const compare = await bcrypt.compare(password, user.password);
  return compare;
};

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;

const mongoose = require("mongoose");

require("dotenv").config();

const CONNECTION_URL = process.env.DATABASE_URL;

const connect = (url) => {
  mongoose.connect(CONNECTION_URL);

  mongoose.connection.on("connected", () => {
    console.log("conncected to the mongoDB successfully");
  });

  mongoose.connection.on("error", (err) => {
    console.log("mongoDb connection error");
    console.log(err);
  });
};

module.exports = { connect };

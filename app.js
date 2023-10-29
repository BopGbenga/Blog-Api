const express = require("express");
require("dotenv").config();
const db = require("./db");
const app = express();
const userRoute = require("./userAuthentication/userrouter");
const blogRoute = require("./blog-authentication/blogRouter");

const PORT = process.env.PORT;

//connecting to mongo
db.connect();
app.use(express.json()); //body-parser

app.use("/users", userRoute);
app.use("/blog", blogRoute);

app.listen(PORT, () => {
  console.log("Server started successfully");
});

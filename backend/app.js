const express = require("express");
const bodyParser = require("body-parser");
var cors=require("cors");
var app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
require("./app/routes/routes.js")(app);
app.listen(3000, () => {
  console.log("Server is running on port 3000.");
});
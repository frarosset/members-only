require("dotenv").config();
const express = require("express");
const path = require("node:path");

// require Routers here

const app = express();

// Init view Engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Serve static files
app.use(express.static("public", { extensions: ["html"] }));

// Parse data for req.body
app.use(express.urlencoded({ extended: true }));

// Use Routers here

// Ignore favicon icon / ... request
app.get(
  ["/favicon.ico", "/.well-known/appspecific/com.chrome.devtools.json"],
  (req, res) => {
    // console.log(`Ignoring request of ${req.path}`);
    res.sendStatus(204); // No Content
  }
);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

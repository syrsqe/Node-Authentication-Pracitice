//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const md5 = require("md5");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));
mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true
});

userSchema = new mongoose.Schema({
  email: String,
  password: String
});

console.log(process.env.SECRET);


const User = new mongoose.model("User", userSchema);


app.get("/", function(req, res) {
  res.render("home");
});
app.route("/login")
  .get(function(req, res) {
    res.render("login");
  })
  .post(function(req, res) {
      // Load hash from your password DB.

      const username = req.body.username;
      const password = req.body.password;
      console.log(password);
      User.findOne({email: username}, function(err, foundUser) {
          if (err) {
            console.log(err);
          } else {
            if (foundUser) {
              bcrypt.compare(password, foundUser.password, function(err, result) {
                if (result === true) {
                  res.render("secrets");
                }
              });
            }
          }
      });
  });

app.route("/register")
  .get(function(req, res) {
    res.render("register");
  })
  .post(function(req, res) {

    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
      const newUser = new User({
        email: req.body.username,
        password: hash
      });
      newUser.save(function(err) {
        if (err) {
          console.log(err);
        } else {
          res.render("secrets");
        }
      });
    });

  });

app.listen(3000, function() {
  console.log("Server started on port 3000");
});

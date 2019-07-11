const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/User");
const Animal = require("../models/Animal");
const uploadCloud = require("../config/cloudinary.js");
// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const multer = require("multer");

router.get("/login", (req, res, next) => {
  res.render("auth/login", { message: req.flash("error") });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/auth/login",
    failureFlash: true,
    passReqToCallback: true
  })
);

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", uploadCloud.single("picture"), (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const imageAvatar = req.file.url;
  const imageAvName = req.file.filename;
  if (username === "" || password === "") {
    res.render("auth/signup", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hashPass,
      picture: {
        url:imageAvatar,
        originalName: imageAvName
      },
    });

    newUser
      .save()
      .then(() => {
        res.redirect("/auth/login");
      })
      .catch(err => {
        res.render("auth/signup", { message: "Something went wrong" });
      });
  });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.get("/json", (req, res) => {
  Animal.find()
  .then(JSONPayLoad =>{
    res.json(JSONPayLoad)
  } )
});

module.exports = router;

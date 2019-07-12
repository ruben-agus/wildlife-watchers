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
// const nodemailer = require("nodemailer") //// nodemailer

////////NODEMAILER abajo enter
// router.post('/send-email', (req, res, next) => {
//   let { email, subject, message } = req.body;
//   res.render('message', { email, subject, message })
// });
//                       let transporter = nodemailer.createTransport({
//                         service: 'Gmail',
//                         auth: {
//                           user: 'acpironhack@gmail.com',
//                           pass: 'ironagus12agus12' 
//                         }
//                       });
/////////////




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
  //////nodemailer abajo hasta la siguiente /////
  // const email = req.body.email;
  
  // const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  // let token = '';
  // for (let i = 0; i < 25; i++) {
  //   token += characters[Math.floor(Math.random() * characters.length)];
  // }
  ////////nodemailer hacia arriba /////

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
      // email: email,///////nodemailer
      // confirmationCode: token, ///////nodemailer
      picture: {
        url: imageAvatar,
        originalName: imageAvName
      }
    });
    
    newUser
    .save()
    .then(() => {
      //////nodemailer hacia abajo hasta ////
            // transporter.sendMail({
            //   from: '"My Awesome Project 👻" <acpironhack@gmail.com',
            //   to: email, 
            //   subject: 'Awesome Subject', 
            //   text: 'Awesome Message',
            //   html: '<b>Please Confirm you e-mail</b>'
            // })
            // .then(info => console.log(info))
            // .catch(error => console.log(error))
        //////nodemailer hacia arriba
        res.redirect("/auth/login");
      })
      .catch(err => {
        res.render("auth/signup", { message: "Something went wrong" });
      })
  
  

///////////nodemailehacia abajo
// router.get("/confirm/:token", (req, res) => {
//   let token = req.params.token;
//   User
//       .findOneAndUpdate({ confirmationCode: req.params.token }, { $set: { status: "Active" } }, { new: true })
//       .then((user) => {
//           console.log("User Activated");
//           res.redirect("/auth/login")
//       }).catch((err) => {
//           console.log(err);
//       })
// });
/////////nodemailerhacia arriba /////


router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.get("/json", (req, res) => {
  Animal.find().then(JSONPayLoad => {
    res.json(JSONPayLoad);
  });
});

module.exports = router;

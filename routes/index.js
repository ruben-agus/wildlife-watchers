const express = require('express');
const router  = express.Router();
const User = require("../models/User");
const Post = require("../models/Post");
const Animal = require("../models/Animal");
const Comment = require("../models/Comment");

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});


router.get('/', (req, res, next) => {
  res.render('animaloftheday');
});


router.get('/', (req, res, next) => {
  res.render('map');
});


router.get('/forum', (req, res, next) => {
  res.render('forum');
});

router.get('/animalist', (req, res, next) => {
  res.render('animallist');
});


router.get('/forum', (req, res, next) => {
  res.render('/forum');
});


router.post("/postcreation", (req, res, next) => {
  Post
  .create({content:req.body.content, picPath:req.body.picPath, picName: req.body.picName})
  res.render("auth/signup");
});



module.exports = router;
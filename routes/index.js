const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Post = require("../models/Post");
const Animal = require("../models/Animal");
const Comment = require("../models/Comment");
// Add passport 
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const ensureLogin = require("connect-ensure-login");  
const uploadCloud = require("../config/cloudinary.js")




/* GET home page */
//   router.get("/", (req, res, next) => {




  
   router.get('/', (req, res, next)=> {
     Animal.find({})
     .then(animal => {
      console.log(animal);
      res.render("index")
     })
     .catch((err) => {
      console.log(err)
  })
   })
//     Post
//   .find()
//   .then(post=>{
//     res.render('index',{post},'animaloftheday',{animal});
//   }).catch((err) => {
//     console.log(err)
//   })
// })


router.get("/profile", ensureLogin.ensureLoggedIn(), (req, res, next) => {
  res.render("profile", { user: req.user });
});
// 
router.post("/profile-edit/:id", ensureLogin.ensureLoggedIn(), uploadCloud.single('picture'),(req, res, next) => {
  if (req.params.id === req.user._id)
    User.findById({ _id: req.params.id })
      .then(user => {
        res.render("profile", { user });
      })
      .catch(err => {
        console.log(err);
      });
});


 

router.get('/create-post',  uploadCloud.single('photo'), (req, res, next) => {
  res.render('create-post');
});

router.post("/create-post", (req, res, next) => {
  const path = req.file.url
  PostBlog.create({
    title: req.body.title,
    content: req.body.content,
    authorId: req.user._id,
    postImg: {
      url: path,
      originalName: req.file.originalname
    }
  })
    .then(postNew => {
      res.redirect("create-post");
    })
    .catch(err => {
      console.log(err);
    });
});

router.get("/edit-post/:id", ensureLogin.ensureLoggedIn(), (req, res, next) => {
  Post.find({ _id: req.params.id })
    // .populate('author')
    .then(postDetail => {
      res.render("edit-post", { postDetail });
    })
    .catch(err => {
      console.log(err);
    });
});

router.post("/edit-post/:id", ensureLogin.ensureLoggedIn(), (req, res, next) => {
  if (req.params.id === req.post.id)
    Post.find({ _id: req.params.id })
      // .populate('author')
      .then(postDetail => {
        res.render("edit-post", { postDetail });
      })
      .catch(err => {
        console.log(err);
      });
});
router.get("/post-detail/:id", (req, res, next) => {
  Post.findOne({ _id: req.params.id })
    .populate("author")
    .then(postDetail => {
      res.render("post-details", { postDetail });
    })
    .catch(err => {
      console.log(err);
    });
});



router.get("/post-list", (req, res, next) => {
  Post.find()
    .then(post => {
      res.render("forum", { post });
    })
    .catch(err => {
      console.log(err);
    });
});

router.get('/animal-list', (req, res, next) => {
Animal
.find()
.then(animal=>{
  res.render('animal-list',{animal});
}).catch((err) => {
  console.log(err)
})
});

router.get('/map',   (req, res, next) => {
  res.render('map');
});



module.exports = router;

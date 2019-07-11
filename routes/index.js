const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Post = require("../models/Post");
const Animal = require("../models/Animal");
const Comment = require("../models/Comment");
// Add passport
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const bcrypt = require("bcrypt");
const bcryptSalt = 10;

const ExifImage = require('exif').ExifImage;


const ensureLogin = require("connect-ensure-login");
const uploadCloud = require("../config/cloudinary.js");
const multer = require("multer");

/* GET home page */

router.get("/", (req, res, next) => {
  //    Animal.find({})
  //    .then(animal => {
  //     console.log(animal);
  //     res.render("index")
  //    })
  //    .catch((err) => {
  //     console.log(err)
  // })
  //  })
  Post.find()
    .populate("authorId")
    .sort({created_at: -1})
    .limit(3)
    .then(postC => {
      res.render("index", {postC: postC });
    })
    .catch(err => {
      console.log(err);
    });
});

router.get("/profile", (req, res, next) => {
  if (!req.user) {
    res.redirect("/auth/login");
  }
  
  if (req.user.postNum >= 5) {
    User.findByIdAndUpdate(req.user._id, {
      skill: "Descubridor"
    }, {new: true}).then(userFound => {
      res.render("profile", userFound)
    })
  } else if (req.user.postNum >= 10) {
    User.findByIdAndUpdate(req.user._id, {
      skill: "Experto"
    }, {new: true}).then(userFound => {
      res.render("profile", userFound)
    }) 
  } else if (req.user.postNum >= 20) {
    User.findByIdAndUpdate(req.user._id, {
      skill: "Jacques Costeau"
    }).then(userFound => {
      res.render("profile", userFound)
    }, {new: true})
  }
  res.render("profile");
});


router.post(
  "/profile-edit/:id",
  ensureLogin.ensureLoggedIn(),
  uploadCloud.single("image"),
  (req, res, next) => {
    User.findById(req.user._id)
    .then(foundUser => {
      if (!bcrypt.compareSync(req.body["password-old"], foundUser.password)) {
        foundUser.errorMessage = "Incorrect password";

        res.render("profile", foundUser);
        return;
      }

      if (req.body["password-new"] !== req.body["password-repeat-new"]) {
        foundUser.errorMessage = "New password doesnt match";
        res.render("profile", foundUser);
        return;
      }

      const bcryptSalt = 10;
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(req.body["password-new"], salt);

      User.findByIdAndUpdate(
        req.user._id,
        { password: hashPass, picture: { url: req.file.url } },
        { new: true }
      ).then(updatedUser => {
        res.render("profile", {user: updatedUser} );
      });
    });
  }
);

router.get("/create-post", uploadCloud.single("image"), (req, res, next) => {
  res.render("create-post");
});

router.get("/post-list", (req, res, next) => {
  Post.find()
    .populate("authorId")
    .then(post => {
      res.render("forum", { post });
    })
    .catch(err => {
      console.log(err);
    });
});


router.post("/post-list", uploadCloud.single("image"), (req, res, next) => {
  
  Post.create({
    authorId: req.user._id,
    title: req.body.title,
    content: req.body.content,
    postImg: req.file.url
  })

  Animal.create({
    name: req.body.animal,
    animalImg:{
      url: req.file.url,
      originalName: req.file.url
    },
    location: {
      type: "Point" , coordinates: [+req.body.lng, +req.body.lat]
    },
  })

  User.findByIdAndUpdate(req.user._id,{$set:{postNum: req.user.postNum + 1}
  })

  // if (User.find(req.user._id))
    .then(postNew => {
      res.redirect("/post-list");
    })
    .catch(err => {
      console.log(err);
    });
});

router.get("/edit-post/:id", ensureLogin.ensureLoggedIn(), (req, res, next) => {
  Post.findById(req.params.id)
    .populate("authorId")
    .then(postDetail => {
      res.render("edit-post", { postDetail });
      console.log("postDetail " + postDetail);
    })
    .catch(err => {
      console.log(err);
    });
});

router.post(
  "/edit-post/:id",
  uploadCloud.single("postImage"),
  (req, res, next) => {
    // console.log(req.params.id);

    Post.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        content: req.body.content,
        postImg: req.file.url
      },
      { new: true }
    )
      .then(editedPost => {
        res.redirect("/post-list");
      })
      .catch(err => {
        console.log(err);
      });
  }
);

router.get("/post-detail/:id", (req, res, next) => {
  Post.findOne({ _id: req.params.id })
    .populate("authorId")
    .populate({
      path: "comments",
      populate: {
        path: "authorId",
        model: "User"
      }
    })

    .then(postDetails => {
      if (
        req.session.passport.user.toString() ===
        postDetails.authorId._id.toString()
      ) {
        postDetails.youAreTheOwnerOfThisPost = true;
      }
      console.log(postDetails);
      res.render("post-details", postDetails);
    })
    .catch(err => {
      console.log(err);
    });
});

router.post("/post-detail/:id/delete", (req, res) => {
  Post.findByIdAndRemove({ _id: req.params.id }, (err, celebrity) => {
    res.redirect("/post-detail");
  });
});

router.get("/animal-list", (req, res, next) => {
  Animal.find()
    .then(animal => {
      res.render("animal-list", { animal });
    })
    .catch(err => {
      console.log(err);
    });
});

router.get("/create-comment/", (req, res, next) => {
  Comment.find()
    .populate("authorId")
    .populate("comments");
  res.render("create-comment");
});
// ensureLogin.ensureLoggedIn(),
router.post("/create-comment", (req, res, next) => {
  Comment.create(
    {
      authorId: req.user._id,
      title: req.body.title,
      content: req.body.content
    },
    { new: true }
  )
    .then(postNew => {
      res.redirect("/create-comment");
    })
    .catch(err => {
      console.log(err);
    });
});
router.get("/map", (req, res, next) => {
  Animal.find().then(animal => {
    res.render("map", animal);
  });
});

module.exports = router;

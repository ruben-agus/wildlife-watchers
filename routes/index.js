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

const ExifImage = require("exif").ExifImage;

const ensureLogin = require("connect-ensure-login");
const uploadCloud = require("../config/cloudinary.js");
const multer = require("multer");
const dms2dec = require("dms2dec");
// const nodemailer = require("nodemailer")

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
    .sort({ created_at: -1 })
    .limit(3)
    .then(postC => {
      res.render("index", { postC: postC });
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
    User.findByIdAndUpdate(
      req.user._id,
      {
        skill: "Descubridor"
      },
      { new: true }
    ).then(userFound => {
      res.render("profile", userFound);
    });
  } else if (req.user.postNum >= 10) {
    User.findByIdAndUpdate(
      req.user._id,
      {
        skill: "Experto"
      },
      { new: true }
    ).then(userFound => {
      res.render("profile", userFound);
    });
  } else if (req.user.postNum >= 20) {
    User.findByIdAndUpdate(req.user._id, {
      skill: "Jacques Costeau"
    }).then(
      userFound => {
        res.render("profile", userFound);
      },
      { new: true }
    );
  }
  res.render("profile");
});

router.post(
  "/profile-edit/:id",
  ensureLogin.ensureLoggedIn(),
  uploadCloud.single("image"),
  (req, res, next) => {
    User.findById(req.user._id).then(foundUser => {
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
        res.render("profile", { user: updatedUser });
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
  var request = require("request").defaults({ encoding: null });
  request.get(req.file.url, function(err, res2, body) {
    try {
      new ExifImage(body, function(error, exifData) {
        let coordinates;

        if (error) {
          coordinates = [+req.body.lng, +req.body.lat];
          console.log("Error: " + error.message);
        } else {
          if (exifData.gps.GPSLatitudeRef) {
            var dec = dms2dec(
              exifData.gps.GPSLatitude,
              exifData.gps.GPSLatitudeRef,
              exifData.gps.GPSLongitude,
              exifData.gps.GPSLongitudeRef
            );

            coordinates = [+dec[1], +dec[0]];
          } else {
            coordinates = [+req.body.lng, +req.body.lat];
          }
        }

        console.log("coordinates ==========" + "*".repeat(100));
        console.log(coordinates);

        Post.create({
          authorId: req.user._id,
          title: req.body.title,
          content: req.body.content,
          postImg: req.file.url
        });

        Animal.create({
          name: req.body.animal,
          description: req.body.description,
          animalImg: {
            url: req.file.url,
            originalName: req.file.url
          },
          location: {
            type: "Point",
            coordinates: coordinates
          }
        });

        User.findByIdAndUpdate(req.user._id, {
          $set: { postNum: req.user.postNum + 1 }
        })

          // if (User.find(req.user._id))
          .then(postNew => {
            res.redirect("/post-list");
          })
          .catch(err => {
            console.log(err);
          });
      });
    } catch (error) {
      console.log("Error: " + error.message);
    }
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

router.delete("/deletePost/:id", (req, res) => {
  Post.findByIdAndDelete(req.params.id).then(x => res.json({ removed: true }));
});


router.post("/post-detail/:id/delete", (req, res) => {
  Post.findByIdAndRemove({ _id: req.params.id }, (err, post) => {
    res.redirect("/post-list");
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

router.get("/create-comment/:id", (req, res, next) => {
  Post.findById({ _id: req.params.id }).then(foundPost => {
    res.render("create-comment", foundPost);
  });
});
// ensureLogin.ensureLoggedIn(),
router.post("/create-comment-post/:id", (req, res, next) => {
  let postId = req.params.id;
  console.log(postId);
  return Comment.create({
    authorId: req.user._id,
    content: req.body.content
  }).then(createdComment => {
    console.log(req.params.id);
    console.log("llllllll" + createdComment._id);
    Post.findByIdAndUpdate(
      req.params.id,
      {
        $push: { comments: createdComment._id }
      },
      {
        new: true
      }
    )
      .then(postNew => {
        console.log(postNew);
        res.redirect(`/post-detail/${postNew._id}`);
      })
      .catch(err => {
        console.log(err);
      });
  });
  // .then(postNew => {
  //   console.log(postNew);
  //   res.redirect(`/post-details/${postNew._id}`);
  // })
  // .catch(err => {
  //   console.log(err);
  // });
});
router.get("/map", (req, res, next) => {
  Animal.find().then(animal => {
    res.render("map", animal);
  });
});

module.exports = router;

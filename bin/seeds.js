// Seeds file that remove all users and create 2 new users

// To execute this seed, run from the root of the project
// $ node bin/seeds.js

require('dotenv').config();


const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Animal = require("../models/Animal");
const Post = require("../models/Post");
const Comment = require("../models/Comment");

const bcryptSalt = 10;


mongoose
  .connect(process.env.BBDD_URL, { useNewUrlParser: true })
  .then(x => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
  })
  .catch(err => {
    console.error("Error connecting to mongo", err);
  });

let exampleUsers = [
  {
    username: "Alice",
    password: bcrypt.hashSync("1234", bcrypt.genSaltSync(bcryptSalt)),
    picture: {
      url: "https://pickaface.net/gallery/avatar/MackennaMeadows542e92aa07839.png",
      originalName: "loquesea"
    },
    skill: "Novato",
    postNum: 0
  },
  {
    username: "Bob",
    password: bcrypt.hashSync("4444", bcrypt.genSaltSync(bcryptSalt)),
    picture: {
      url: "https://pickaface.net/gallery/avatar/unr_mrsbob_180716_0154_16ff.png",
      originalName: "whatever"
    },
    skill: "Experto",
    postNum: 0
  }
];

let exampleAnimal = {
  name: "Coyote",
  description: "Similar a un lobo pero adepto a arrancarte la cara",
  animalImg: {
    url: "https://i.ytimg.com/vi/XOj6xGKEsUw/maxresdefault.jpg",
    originalName: "coyotaco.jpg"
  },
  location: { type: "Point",
  coordinates: [24, 24]} 
};

// let examplePost = {
//   authorId: { type: Schema.Types.ObjectId, ref: "User" },
//   postImg: {
//     url: "https://i.ytimg.com/vi/XOj6xGKEsUw/maxresdefault.jpg",
//     originalName: "coyotaco.jpg"
//   },
//   title: "Esto es un coyote",
//   content: "Los coyotes os comen desde el cogote",
//   comments: { type: Schema.Types.ObjectId, ref: "Comment" }
// };

// let exampleComment = {
//   authorId: { type: Schema.Types.ObjectId, ref: "User" },
//   content: "QUE PEDASO DE COYOTE, CABESA"
// };

User.remove()
  .then(x => {
    return Comment.remove();
  })
  .then(x => {
    return Post.remove();
  })
  .then(x => {
    return Animal.remove();
  })
  .then(x => {
    let userId;
    let userBId;


    User.create(exampleUsers)
      .then(createdUsers => {
        userId = createdUsers[0]._id;
        userBId = createdUsers[1]._id;
        return Comment.create([
          { content: '"QUE PEDASO DE COYOTE, CABESA"', author: userId } , 
        ]);
      })
      .then(createdComment => {
        return Post.create([
          {
            title: "Esto es un coyote",
            content: "Los coyotes os comen desde el cogote",
            author: userBId,
            postImg: {
              url: "https://i.ytimg.com/vi/XOj6xGKEsUw/maxresdefault.jpg",
              originalName: "coyotaco.jpg"
            },
            comments:[createdComment[0]._id] 
          }
        ]);
      })
      .then(createdPost => {
        Post.find()
          .populate("author")
          .populate({
            path: "comments",
            populate: {
              path: "author",
              model: "User"
            }
          })
          .then(popPost => {
            Animal.create(exampleAnimal).then(createdAnimal => {
            console.log(JSON.stringify(popPost));
            process.exit(0);
            }) 
          });
      });
  });

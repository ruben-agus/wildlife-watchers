// Seeds file that remove all users and create 2 new users

// To execute this seed, run from the root of the project
// $ node bin/seeds.js

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Animal = require("../models/Animal");
const Post = require("../models/Post")

const bcryptSalt = 10;

mongoose
  .connect('mongodb://localhost/iberian-wild-life', {useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

let users = [
  {
    username: "alice",
    password: bcrypt.hashSync("alice", bcrypt.genSaltSync(bcryptSalt)),
    // picture:{
    //   url:String,
    //   originalName: url
    // },
    skill: "Novato",
    postNum:0
  },
  {
    username: "bob",
    password: bcrypt.hashSync("bob", bcrypt.genSaltSync(bcryptSalt)),
  }
]

let animal = [
  {
    name: "coyote",
    description: "similar a un lobo peor en achuchable",
  }
]

let Post =[{
  title: "Esto es una prueba",
  content: "Esta foto la saqué ayer"
}]





User.deleteMany()
.then(() => {
  return User.create(users)
})
.then(usersCreated => {
  console.log(`${usersCreated.length} users created with the following id:`);
  console.log(usersCreated.map(u => u._id));
})
.then(() => {
  // Close properly the connection to Mongoose
  mongoose.disconnect()
})
.catch(err => {
  mongoose.disconnect()
  throw err
})


Animal.deleteMany()
.then(() => {
  return animal.create(animals)
})
.then(animalsCreated => {
  console.log(`${animalsCreated.length} animals created with the following id:`);
  console.log(animalsCreated.map(a => a._id));
})
.then(() => {
  // Close properly the connection to Mongoose
  mongoose.disconnect()
})
.catch(err => {
  mongoose.disconnect()
  throw err
})



Post.deleteMany()
.then(() => {
  return Post.create(posts)
})
.then(postsCreated => {
  console.log(`${postsCreated.length} posts created with the following id:`);
  console.log(postsCreated.map(u => u._id));
})
.then(() => {
  // Close properly the connection to Mongoose
  mongoose.disconnect()
})
.catch(err => {
  mongoose.disconnect()
  throw err
})

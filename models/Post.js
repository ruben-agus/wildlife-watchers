const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const postSchema = new Schema({
  username: String,
  picture: String,
  post: String,
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const User = mongoose.model('Post', postSchema);
module.exports = Post;

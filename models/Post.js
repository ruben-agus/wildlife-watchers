const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const postSchema = new Schema({
  authorId: {type:Schema.Types.ObjectId, ref:"User"},
  postImg: {
    url:String,
    originalName: String
  },
  title: String,
  content: String, 
  comments:  {type:Schema.Types.ObjectId, ref:"Comment"}

},
 {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Post = mongoose.model('Post', postSchema);
module.exports = Post;

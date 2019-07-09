const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const postSchema = new Schema({
  authorId: {type:Schema.Types.ObjectId, ref:"User"},
  postImg: String,
   
  title: String,
  content: String, 
  comments:  {type:Schema.Types.ObjectId, ref:"Comment"},
  // location:{type:{type:String}, coordinates:[Number] } 

},
 {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Post = mongoose.model('Post', postSchema);
module.exports = Post;

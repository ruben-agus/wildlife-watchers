const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const commentSchema = new Schema({
  authorId: {type:Schema.Types.ObjectId, ref:"User"},
  content: String, 
},
 {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;

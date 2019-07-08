const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String,
  picture: {
    url:String,
    originalName: String
  },
  skill:{
    enum:["Novato", "Descubridor", "Experto", "Jacques Costeau"],
    default:"Novato"
  },
  postNum:0
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;

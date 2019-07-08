const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const animalSchema = new Schema({
  name: String,
  picture: String,
  

}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const User = mongoose.model('Animal', animalSchema);
module.exports = Animal;

const mongoose = require('mongoose');
const paintingSchema = new mongoose.Schema({
  title: String,
  medium: String,
  created: Date,
  price: Number,
  sold: Boolean,
  description: String,
});

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

exports.Painting = mongoose.model('Painting', paintingSchema);
exports.User = mongoose.model('User', userSchema);

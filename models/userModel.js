const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    require: [true, 'Username required!'],
    unique: true,
  },
  email: {
    type: String,
    require: [true, 'email required!'],
    unique: true,
  },
  password: {
    type: String,
    require: [true, 'Password required!'],
  },
});

const User = mongoose.Model('User', userSchema);

module.exports = User;
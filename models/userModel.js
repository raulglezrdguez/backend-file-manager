const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, "Username required!"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "email required!"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password required!"],
  },
  createdAt: {
    type: String,
    required: [true, "CreatedAt required!"],
  },
  status: {
    type: Number,
    required: [true, "Status required!"],
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;

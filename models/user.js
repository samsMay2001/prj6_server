const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: [true, "First name is required"],
  },
  lastname: {
    type: String,
    required: [true, "Last name is required "],
  },
  avatar: {
    type: String,
  },
  email: {
    type: String,
    required: [true, "Last name is required "],
    validate: {
      validator: function (email) {
        return String(email)
          .toLowerCase()
          .match(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/);
      },
      message: (props) => `Email (${props.value}) is invalid`,
    },
  },
  password: {
    type: String,
  },
  passwordChangedAt: {
    type: Date,
  },
  passwordResetToken: {
    type: String,
  },
  passwordResetExpires: {
    type: Date,
  },
  createdAt: {
    type: Date,
  },
  updatedAt: {
    type: Date,
  },
});

const User = new mongoose.model("User", userSchema);
module.exports = User;
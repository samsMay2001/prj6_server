const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const userSchema = new mongoose.Schema({
  firstName: {
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
userSchema.methods.correctPassword = async function (
  canditatePassword, // 123456
  userPassword, // wjmwju1881991
) {
  return await bcrypt.compare(canditatePassword, userPassword);
};

const User = new mongoose.model("User", userSchema);
module.exports = User;

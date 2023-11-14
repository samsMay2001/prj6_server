const JWT_SECRET = "asdfj231@!??l9i093097ajkjcipaiue";

const User = require("../../models/user");
const create_func = require("./createuser");
const login_func = require("./loginuser");

module.exports = {
  get: async (req, res) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: err });
    }
  },
  create: async (req, res) => {
    create_func(User, req, res);
  },
  login: async (req, res) => {
    login_func(User, req, res); // not tested
  },
};

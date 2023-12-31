const filterObj = require("../../utils/filterObj");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "asdfj231@!??l9i093097ajkjcipaiue";
const bcrypt = require("bcryptjs");
const signToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET);
};

async function hashPassword(password) {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

const create_func = async (User, req, res) => {
  const { email } = req.body;

  const filteredBody = await filterObj(
    req.body,
    "firstname",
    "lastname",
    "email",
    "password",
  ); // filterObj tested

  // is user verified
  const existing_user = await User.findOne({ email: email });

  if (existing_user) {
    return res.status(400).json({
      status: "error",
      message: "User already exists",
    });
  } else {
    // user is not registered
    try {
      // first hash the password
      const hashed_pass = await hashPassword(filteredBody.password); // returns hashed password
      filteredBody.password = hashed_pass;
      // create the user
      const new_user = await User.create(filteredBody);

      // return a token and a token
      const token = signToken(new_user._id); // tested

      // console.log();
      return res.status(200).json({
        firstname: new_user.firstname, 
        lastname: new_user.lastname, 
        _id: new_user._id, 
        token : token, 
        email: new_user.email
      });
    } catch (err) {
      console.log(err);
      res
        .status(500)
        .json({ error: "An error occured while processing your request" });
    }
  }
};

module.exports = create_func;

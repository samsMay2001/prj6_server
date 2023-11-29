const jwt = require("jsonwebtoken");
const JWT_SECRET = "asdfj231@!??l9i093097ajkjcipaiue";
const bcrypt = require("bcryptjs");
const signToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET);
};

const login = async (User, req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      status: "error",
      message: "Both email and password are required",
    });
  }

  const userDoc = await User.findOne({ email: email }); // tested
  // return res.send(userDoc);
  if (!userDoc || (await bcrypt.compare(userDoc.password, password))) {
    return res.status(400).json({
      status: "error",
      message: "Email or password is incorrect",
    });
  } // tested

  const token = signToken(userDoc._id); // tested
  res.status(200).json({
    status: "success",
    message: "Logged in successfuly",
    token: token,
    _id: userDoc._id,
    firstname: userDoc.firstname,
    lastname: userDoc.lastname,
  });
};

module.exports = login;

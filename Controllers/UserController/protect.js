const JWT_SECRET = "asdfj231@!??l9i093097ajkjcipaiue";

const protect = async (User, req, res, next) => {
  // not tested
  // getting token and check if it's there

  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  } else {
    return req.status(400).json({
      status: "error",
      message: "Access dinied. you must be logged in",
    });
  }

  // verification of token
  const decoded = await promisify(jwt.verify)(token, JWT_SECRET);

  // check if the user still exists
  const this_user = await User.findById(decoded.userId);

  if (!this_user) {
    res.status(400).json({
      status: "error",
      message: "this user doesn't exist",
    });
  }

  req.user = this_user;
  next();
};
module.exports = protect;

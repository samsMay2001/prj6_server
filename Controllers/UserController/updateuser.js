const filterObj = require("../../utils/filterObj");

const update = async (User, req, res) => {
  const { userId } = req;

  const filteredBody = await filterObj(
    req.body,
    "firstname",
    "lastname",
    "about",
    "avatar",
  ); // filterObj tested

  //   return res.send(filteredBody);
  // is user verified
  try {
    const updated_user = await User.findByIdAndUpdate(userId, filteredBody, {
      new: true,
      validateModifiedOnly: true,
    });

    res.status(200).json({
      status: "success",
      data: updated_user,
      message: "Profile Updated successfuly",
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: "error on the server",
    });
  }
};

module.exports = update;

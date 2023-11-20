const getFriends = async (req, res, User) => {
  try {
    const current_user = await User.findById(req.body._id).populate(
      "friends",
      "_id firstaname lastname",
    );
    res.status(200).json({
      status: "success",
      data: current_user.friends,
      message: "Friends found successfuly",
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: "error",
      message: "error getting friends",
    });
  }
};

module.exports = getFriends;

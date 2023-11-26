const getFriends = async (req, res, User) => {
  try {
    const current_user = await User.findById(req.body._id).populate(
      "friends",
      "_id firstname lastname",
    );
    const userFriends = [];
    for (let a = 0; a < current_user.friends.length; a++) {
      const fullFriend = await User.findById(current_user.friends[a]).select(
        "_id firstname lastname",
      );
      userFriends.push(fullFriend);
    }
    res.status(200).json({
      status: "success",
      data: userFriends,
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

const allUsers = async (req, res, User) => {
  try {
    const users = await User.find().select("firstname lastname _id");
    //   filter out the current user and their friends
    // return res.json(req.body)
    const this_user = req.body;
    const remaining_users = users.filter(
      (user) =>
        !this_user.friends.includes(user._id) &&
        user._id.toString() !== this_user._id.toString(),
    );

    res.json({
      status: "success",
      data: remaining_users,
      message: "Users found successfuly!",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err });
  }
};

module.exports = allUsers;

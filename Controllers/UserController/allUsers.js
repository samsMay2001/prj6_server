const FriendRequest = require("../../models/friendRequests");

const allUsers = async (req, res, User) => {
  const users = await User.find().select("firstname lastname friends _id");
  //   filter out the current user and their friends
  // also filter out friend requests
  // return res.json(req.body)
  // if the user logged in is not connected
  const this_user = req.body;
  try {
    const requests = await FriendRequest.find({
      sender: req.body._id,
    }).populate("recipient", "_id firstname lastname");

    const addedUsers = [];
    requests.forEach(function (item) {
      addedUsers.push(item.recipient._id.toString());
    });
    const currentUserIndex = users.findIndex(
      (user) => user._id.toString() === this_user._id,
    );
    // this filters out the current user
    const remaining_users = users.filter(
      (user) => user._id.toString() !== this_user._id.toString(),
    );
    const remaining_users1 = [];

    // this filters out the current user friends
    remaining_users.forEach((user) => {
      users[currentUserIndex].friends.forEach((friend) => {
        if (friend.toString() === user._id.toString()) {
          const newUserObj = { ...user._doc, friend: true };
          remaining_users1.push(newUserObj);
        } else {
          const newUserObj = { ...user._doc, friend: false };
          remaining_users1.push(newUserObj);
        }
      });
    });
    // this adds the added property for users who have been sent friend request but haven't accepted yet
    const usersWithAddedFlag = remaining_users1.map((userObj) => {
      if (addedUsers.includes(userObj._id.toString())) {
        // Create a new object with the "added" property
        return { ...userObj, added: true };
      } else {
        // If "added" property is not needed, return the original object
        return { ...userObj, added: false };
      }
    });

    // remove users who are friends already
    // const current_users_1 = usersWithAddedFlag.filter((user) => user.friends.includes())

    res.json({
      status: "success",
      data: usersWithAddedFlag,
      message: "Users found successfuly!",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err });
  }
};

module.exports = allUsers;

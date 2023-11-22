const FriendRequest = require("../../models/friendRequests");

const allUsers = async (req, res, User) => {
  const users = await User.find().select("firstname lastname _id");
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
      const remaining_users = users.filter(
        (user) =>
          // !this_user.friends.includes(user._id) &&
          user._id.toString() !== this_user._id.toString(),
      );
      const usersWithAddedFlag = remaining_users.map((userObj) => {
        if (addedUsers.includes(userObj._id.toString())) {
          // Create a new object with the "added" property
          return { ...userObj._doc, added: true };
        } else {
          // If "added" property is not needed, return the original object
          return {...userObj._doc, added: false};
        }
      });
      res.json({
        status: "success",
        data: usersWithAddedFlag,
        message: "Users found successfuly!",
      });
    }catch (err) {
    console.log(err);
    res.status(500).json({ message: err });
  }
};

module.exports = allUsers;

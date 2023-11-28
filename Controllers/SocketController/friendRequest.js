const onFriendRequest = async (socketIO, data, User, FriendRequest) => {
  try {
    if (data.to && data.from) {
      const to = await User.findById(data.to);
      const to_user = await User.findById(data.to).select("socket_id");
      const from_user = await User.findById(data.from).select("socket_id"); //currently, data.from is 0 abd findById only works with 24 character hex strings
      await FriendRequest.create({
        sender: data.from,
        recipient: data.to,
      });
      socketIO.to(to_user.socket_id).emit("new_friend_request", {
        message: "New friend request recieved",
      });
      socketIO.to(from_user.socket_id).emit("request_sent", {
        message: "Request sent successfully",
      });
    }
  } catch (err) {
    console.log(err);
  }
};
module.exports = onFriendRequest;

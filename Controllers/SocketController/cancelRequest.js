const onCancelRequest = async (socketIO, data, User, FriendRequest) => {
  try {
    // find the request where the sender is data.from_id and receiver isdata.to_id
    const friendRequests = await FriendRequest.find();
    const to_user = await User.findById(data.to_id).select("socket_id");
    const from_user = await User.findById(data.from_id).select("socket_id");
    const requestId = friendRequests.findIndex(
      (item) =>
        item.sender.toString() === data.from_id &&
        item.recipient.toString() === data.to_id,
    );
    await FriendRequest.findByIdAndDelete(friendRequests[requestId]._id);
    socketIO.to(from_user.socket_id).emit("request_cancelled", {
      message: "friend request accepted",
    });
    socketIO.to(to_user.socket_id).emit("request_cancelled", {
      message: "friend request cancelled",
    });
  } catch (err) {
    console.log(err);
  }
};
module.exports = onCancelRequest;

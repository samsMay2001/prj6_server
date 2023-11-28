const onAcceptRequest = async (socketIO, data, User, FriendRequest) => {
  try {
    const request_doc = await FriendRequest.findById(data.request_id);
    const sender = await User.findById(request_doc.sender);
    const receiver = await User.findById(request_doc.recipient);

    // // add to the sender and reciever friends array
    sender.friends.push(request_doc.recipient);
    receiver.friends.push(request_doc.sender);

    await receiver.save({ new: true, validateModifiedOnly: true });
    await sender.save({ new: true, validateModifiedOnly: true });

    // add that a property of accepted to equal to true
    await FriendRequest.findByIdAndUpdate(data.request_id, {
      accepted: true,
    });

    socketIO.to(sender.socket_id).emit("request_accepted", {
      message: "friend request accepted",
    });
    // the user may not have a socket id
    socketIO.to(receiver.socket_id).emit("request_accepted", {
      message: "friend request accepted",
    });
  } catch (err) {
    console.log(err);
  }
};
module.exports = onAcceptRequest;

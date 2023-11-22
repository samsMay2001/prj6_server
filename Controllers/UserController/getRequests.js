const getRequests = async (req, res, User, FriendRequest) => {
  try {
    const requests = await FriendRequest.find({
      recipient: req.body._id,
    }).populate("sender", "_id firstname lastname");
    res.status(200).json({
      status: "success",
      data: requests,
      message: "Requests found successfuly",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err });
  }
};

module.exports = getRequests;

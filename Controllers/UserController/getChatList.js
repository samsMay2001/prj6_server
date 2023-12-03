const mongoose = require("mongoose");

const getChatList = async (req, res, ChatRoom) => {
  try {
    const { user_id } = req.body; // Assuming the user ID is in req.body.userId

    const chatList = await ChatRoom.find({
      participants: { $in: [new mongoose.Types.ObjectId(user_id)] },
    });

    res.status(200).json(chatList);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};
module.exports = getChatList;

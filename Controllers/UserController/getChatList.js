const mongoose = require("mongoose");

const getChatList = async (req, res, ChatRoom, User) => {
  try {
    const { user_id } = req.body; // Assuming the user ID is in req.body.userId

    const chatList = await ChatRoom.find({
      participants: { $in: [new mongoose.Types.ObjectId(user_id)] },
    });
    const newChatList = await Promise.all(
      chatList.map(async (chat) => {
        const names = [];
        for (const participantId of chat.participants) {
          const user = await User.findById(participantId);
          if (user) {
            names.push(user.firstname);
          }
        }
        // Add a new property called 'names' to the chat object
        return { ...chat._doc, names: names, msg: "", time: "9:00 am" };
      }),
    );
    res.status(200).json(newChatList);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};
module.exports = getChatList;

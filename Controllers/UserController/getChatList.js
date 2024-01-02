const mongoose = require("mongoose");

const getChatList = async (req, res, ChatRoom, User) => {
  try {
    const { user_id, currentChat } = req.body; // Assuming the user ID is in req.body.userId

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
    if (currentChat !== undefined){
      const chatListCopy = JSON.parse(JSON.stringify(newChatList))
      const indexOfVal =  chatListCopy.findIndex(chat => chat.participants.includes(currentChat.toString()))
      const valueToMove = chatListCopy.splice(indexOfVal, 1)[0]; 
      chatListCopy.unshift(valueToMove)
      console.log(valueToMove)
      res.status(200).json(chatListCopy);
    }else {
      throw new Error("currentChat is undefined")
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};
module.exports = getChatList;

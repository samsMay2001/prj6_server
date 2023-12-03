const mongoose = require("mongoose");

const ChatRoomSchema = new mongoose.Schema({
  participants: [
    {
      type: mongoose.Schema.ObjectId,
    },
  ],
});

const ChatRoom = new mongoose.model("ChatRooms", ChatRoomSchema);

module.exports = ChatRoom;

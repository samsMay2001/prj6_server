const mongoose = require("mongoose");

const ChatRoomSchema = new mongoose.Schema({
  participants: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  ],
});

const ChatRoom = new mongoose.model("ChatRooms", ChatRoomSchema);

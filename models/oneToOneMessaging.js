const mongoose = require("mongoose");

const MessagesSchema = new mongoose.Schema({
  messages: [
    {
      to: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
      from: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
      type: {
        type: String,
        enum: ["Text", "Media", "Document", "Link"],
      },
      created_at: {
        type: Date,
        default: Date.now(),
      },
      message: {
        type: String,
      },
      file: {
        type: String,
      },
    },
  ],
});

const Message = new mongoose.model("Messages", MessagesSchema);
module.exports = Message;

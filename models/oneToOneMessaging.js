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

/**example 1
 * to : ObjectId("6553e79f3f4b4c89c06a4554")
 * from : ObjectId("65577ffcc3b0a082f8b454ac")
 * type: "Text",
 * created_at: 1701623724341,
 * message: "Hi Sam"
 * file: ""
 */
/**example 2
 * to : ObjectId("65577ffcc3b0a082f8b454ac")
 * from : ObjectId("6553e79f3f4b4c89c06a4554")
 * type: "Text",
 * created_at: 1701623908421,
 * message: "Hi Pedro, how are you today?"
 * file: ""
 */

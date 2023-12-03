const mongoose = require("mongoose");
const getMessages = async (req, res, Message) => {
  /**
   * get all messages that have req.body.from === to sender or receiver and req.body.to === to sender or receiver
   * the name of the mongodb collection is Message
   * so it's something like Message.findBy...
   */
  try {
    const { from, to } = req.body;

    const messages = await Message.find({
      $or: [
        {
          from: new mongoose.Types.ObjectId(from),
          to: new mongoose.Types.ObjectId(to),
        },
        {
          from: new mongoose.Types.ObjectId(to),
          to: new mongoose.Types.ObjectId(from),
        },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};
module.exports = getMessages;

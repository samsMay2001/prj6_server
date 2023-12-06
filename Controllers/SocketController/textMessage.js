const mongoose = require('mongoose')
const onTextMessage = async (data, Message, User, ChatRoom, socketIO) => {
    // data : {from, to, message, type, conversation_id}
    // Message, User, ChatRoom
    const {from, to, message, type, created_at, file} = data

    // console.log(to)

    const new_message = {from, to, message, type, created_at, file}

    try{
      
      // check if the message already exists
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
      const sender = await User.findById(from)
      const receiver = await User.findById(to)
      if (messages.length === 0){
        // create a new chat
        const new_chat = {
          participants : [from, to]
        }
        await ChatRoom.create(new_chat)
      }
      // add to the messages array
      await Message.create(new_message)
      // await onTextMessage(data);
      socketIO.to(sender.socket_id).emit("message_sent", {
        message: "message sent successfully"
      })
      socketIO.to(receiver.socket_id).emit("new_message", {
        message: 'new_message'
      })
    }catch(err){
      console.log(err)
    }
};
module.exports = onTextMessage;

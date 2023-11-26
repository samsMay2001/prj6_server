const express = require("express");
const mongoose = require("mongoose");
const app = express();
const http = require("http").createServer(app);
const socketIO = require("socket.io")(http, {
  cors: {
    origin: "*",
  },
});
const bodyparser = require("body-parser"); // parsing requests
const rateLimit = require("express-rate-limit"); //  protecting server from over loaded requests from the same IP, which is a form of attack
const cors = require("cors"); // cross origin resource sharing / requests from different domains
const PORT = 4000;
const dotenv = require("dotenv");
const useRoute = require("./Routes/user");
dotenv.config({ path: "./confing.env" });

const User = require("./models/user");
const FriendRequest = require("./models/friendRequests");

app.use(
  cors({
    origin: "*",
    methods: ["GET", "PATCH", "POST", "DELETE", "PUT"],
    credentials: true,
  }),
);
app.use(express.json({ limit: "10kb" }));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

const limiter = rateLimit({
  max: 3000,
  windowMS: 60 * 60 * 1000,
  message: "Too many requests on this IP, Please try again in an hour",
});

const connectMongo = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://samsMay:samever7@cluster0.zyihuu3.mongodb.net/?retryWrites=true&w=majority",
      {
        useNewUrlParser: true, // this is not needed in this version of nodejs
        // useCreateIndex: true, // this option doesn't work any more
        // useFindandModify: false, // this option doesn't work any more
        useUnifiedTopology: true, // this is not needed in this version of nodejs
      },
    );
    console.log("db connection success");
  } catch (err) {
    console.log(err);
  }
};

app.use("/tawk", limiter);

app.use(express.urlencoded({ extended: true }));
connectMongo();
app.use("/", useRoute);
http.listen(PORT, () => {
  console.log(`server is live on ${PORT}`);
});

socketIO.on("connection", async (socket) => {
  // console.log("A user connected");
  const user_id = socket.handshake.query["user_id"];
  const socket_id = socket.id;

  if (user_id) {
    // creates the socket property in the User schema for this particular user
    await User.findByIdAndUpdate(user_id, { socket_id });
  }
  socket.on("friend_request", async (data) => {
    try {
      if (data.to_id && data.from_id){
        const to = await User.findById(data.to);
        const to_user = await User.findById(data.to).select("socket_id");
        const from_user = await User.findById(data.from).select("socket_id"); //currently, data.from is 0 abd findById only works with 24 character hex strings
        await FriendRequest.create({
          sender: data.from,
          recipient: data.to,
        });
        socketIO.to(to_user.socket_id).emit("new_friend_request", {
          message: "New friend request recieved",
        });
        socketIO.to(from_user.socket_id).emit("request_sent", {
          message: "Request sent successfully",
        });
      }
    } catch (err) {
      console.log(err);
    }
  });
  socket.on("cancel_request", async (data) => {
    try {
      // find the request where the sender is data.from_id and receiver isdata.to_id
      const friendRequests = await FriendRequest.find();
      const to_user = await User.findById(data.to_id).select("socket_id");
      const from_user = await User.findById(data.from_id).select("socket_id");
      const requestId = friendRequests.findIndex(
        (item) =>
          item.sender.toString() === data.from_id &&
          item.recipient.toString() === data.to_id,
      );
      await FriendRequest.findByIdAndDelete(friendRequests[requestId]._id);
      socketIO.to(from_user.socket_id).emit("request_cancelled", {
        message: "friend request accepted",
      });
    } catch (err) {
      console.log(err);
    }
  });
  socket.on("accept_request", async (data) => {
    try {
      const request_doc = await FriendRequest.findById(data.request_id);
      const sender = await User.findById(request_doc.sender);
      const receiver = await User.findById(request_doc.recipient);

      console.log(request_doc)
      // sender.friends.push(request_doc.recipient);
      // receiver.friends.push(request_doc.sender);

      // await receiver.save({ new: true, validateModifiedOnly: true });
      // await sender.save({ new: true, validateModifiedOnly: true });

      // delete the friend request
      // await FriendRequest.findByIdAndDelete(data.request_id);

      socketIO.to(sender.socket_id).emit("request_accepted", {
        message: "friend request accepted",
      });
    } catch (err) {
      console.log(err);
    }
  });
  socket.on("end", () => {
    console.log("closing connection");
    socket.disconnect(0);
  });
});

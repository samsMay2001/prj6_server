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
const onFriendRequest = require("./Controllers/SocketController/friendRequest");
const onAcceptRequest = require("./Controllers/SocketController/acceptRequest");
const onCancelRequest = require("./Controllers/SocketController/cancelRequest");

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
    await User.findByIdAndUpdate(user_id, { socket_id, status: "Online" });
  }
  socket.on("friend_request", async (data) => {
    await onFriendRequest(socketIO, data, User, FriendRequest);
  });
  socket.on("cancel_request", async (data) => {
    await onCancelRequest(socketIO, data, User, FriendRequest);
  });
  socket.on("accept_request", async (data) => {
    await onAcceptRequest(socketIO, data, User, FriendRequest);
  });
  socket.on("end", async (data) => {
    if (data.user_id) {
      await User.findByIdAndUpdate(data.user_id, { status: "offline" });
    }
    console.log("closing connection");
    socket.disconnect(0);
  });
});

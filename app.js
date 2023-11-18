const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const morgan = require("morgan"); // request logger middleware
const bodyparser = require("body-parser"); // parsing requests
const rateLimit = require("express-rate-limit"); //  protecting server from over loaded requests from the same IP, which is a form of attack
const helmet = require("helmet"); // helps in setting up headers for responses
const mongosanitize = require("express-mongo-sanitize"); // mongo queries attacks protection
const xss = require("xss"); // params malicious attacks
const cors = require("cors"); // cross origin resource sharing / requests from different domains
const PORT = 4000;
const dotenv = require("dotenv");
const useRoute = require("./Routes/user");
const DB_URI =
  "mongodb+srv://samsMay:samever7@project6.z9nfdkn.mongodb.net/?retryWrites=true&w=majority";
const DB_PSWD = "samever7";
dotenv.config({ path: "./confing.env" });
const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");
const User = require("./models/user");
const io = new Server(server, {
  cors: {
    origin: "https://j55mxk-3000.csb.app",
    methods: ["GET", "POST"],
  },
});
io.on("connection", async (socket) => {
  const user_id = socket.handshake.query["user_id"];
  const socket_id = socket.id;
  console.log("user connected", socket_id);
  if (user_id) {
    await User.findByIdAndUpdate(user_id, { socket_id });
  }
  socket.on("friend_request", async (data) => {
    console.log(data.to);
    const to = await User.findById(data.to);
    io.to(to.socket_id).emit("new_friend_request", {
      // create friend requests.
    });
  });
});

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
// app.use(xss());
// app.use(helmet());

// live feed back from server
/**
 * if (process.env.NODE_ENV === "development"){
 *      app.use(morgan("dev"));
 *
 * }
 */

const limiter = rateLimit({
  max: 3000,
  windowMS: 60 * 60 * 1000,
  message: "Too many requests on this IP, Please try again in an hour",
});

// const DB = DB_URI.replace("<PASSWORD>", DB_PSWD);

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
app.listen(PORT, () => {
  console.log(`server is live on ${PORT}`);
});

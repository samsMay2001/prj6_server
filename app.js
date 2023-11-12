const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan"); // request logger middleware
const bodyparser = require("body-parser"); // parsing requests
const rateLimit = require("express-rate-limit"); //  protecting server from over loaded requests from the same IP, which is a form of attack
const helmet = require("helmet"); // helps in setting up headers for responses
const mongosanitize = require("express-mongo-sanitize"); // mongo queries attacks protection
const xss = require("xss"); // params malicious attacks
const cors = require("cors"); // cross origin resource sharing / requests from different domains
const PORT = 4000;
const dotenv = require("dotenv");
const DB_URI =
  "mongodb+srv://samsMay:samever7@project6.z9nfdkn.mongodb.net/?retryWrites=true&w=majority";
const DB_PSWD = "samever7";
dotenv.config({ path: "./confing.env" });

const app = express();
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
    await mongoose.connect("mongodb+srv://samsMay:samever7@cluster0.zyihuu3.mongodb.net/?retryWrites=true&w=majority");
    console.log("db connection success");
  } catch (err) {
    console.log(err);
  }
};

app.use("/tawk", limiter);

app.use(express.urlencoded({ extended: true }));
connectMongo();
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.listen(PORT, () => {
  console.log(`server is live on ${PORT}`);
});

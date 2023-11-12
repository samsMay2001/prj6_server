const express = require("express");
const morgan = require("morgan"); // request logger middleware
const bodyparser = require("body-parser"); // parsing requests
const rateLimit = require("express-rate-limit"); //  protecting server from over loaded requests from the same IP, which is a form of attack
const helmet = require("helmet"); // helps in setting up headers for responses
const mongosanitize = require("express-mongo-sanitize"); // mongo queries attacks protection
// const urlencoded = require("body-parser/lib/types/urlencoded"); // parsing requests
const xss = require("xss"); // params malicious attacks
const cors = require("cors"); // cross origin resource sharing / requests from different domains
const PORT = 4000;

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

app.use("/tawk", limiter);

app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.listen(PORT, () => {
  console.log(`server is live on ${PORT}`);
});
console.log("app is running");

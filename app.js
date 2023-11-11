const express = require("express");
const morgan = require("morgan");
const app = express();

const PORT = 4000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.listen(PORT, () => {
  console.log(`server is live on ${PORT}`);
});
console.log("app is running");

const express = require("express");
const auth = require("../Controllers/auth");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hello world");
});
router.get("/login", auth.login);

module.exports = router;

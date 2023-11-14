const express = require("express");
const router = express.Router();
const user = require("../Controllers/UserController/userController");
router.get("/", (req, res) => {
  res.send("Hello world");
});
router.get("/login", user.login); // not tested
router.get("/newuser", user.create);

module.exports = router;

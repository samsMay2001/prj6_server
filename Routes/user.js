const express = require("express");
const router = express.Router();
const user = require("../Controllers/UserController/userController");
router.get("/", (req, res) => {
  res.send("Hello world");
});
router.get("/login", user.login);
router.post("/newuser", user.create);
router.post(
  "/updateuser",
  //  user.protect, // not tested
  user.update,
);

module.exports = router;

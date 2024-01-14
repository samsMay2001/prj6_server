const express = require("express");
const router = express.Router();
const user = require("../Controllers/UserController/userController");
router.get("/", (req, res) => {
  res.send("Hello world");
});
router.post("/login", user.login);
router.post("/newuser", user.create);
router.post(
  "/updateuser",
  //  user.protect, // not tested
  user.update,
);
router.post("/users", user.get); // tested
router.post("/friends", user.getFriends); // tested
router.post("/requests", user.getRequests); // tested
router.post("/messages", user.getMessages); // tested
router.post("/chatlist", user.getChatList);
router.post('/start-voice-call', user.startVoiceCall); 

module.exports = router;

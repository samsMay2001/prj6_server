const JWT_SECRET = "asdfj231@!??l9i093097ajkjcipaiue";

const User = require("../../models/user");
const FriendRequest = require("../../models/friendRequests");
const Message = require("../../models/oneToOneMessaging");
const ChatRoom = require("../../models/chatRooms");
const create_fc = require("./createuser");
const login_fc = require("./loginuser");
const protect_fc = require("./protect");
const update_fc = require("./updateuser");
const allUsers_fc = require("./allUsers");
const getFriends_fc = require("./getFriends");
const getRequests_fc = require("./getRequests");
const getMessages_fc = require("./getMessages");
const getChatList_fc = require("./getChatList");
const startVoiceCall_fc = require("./startVoiceCall"); 

module.exports = {
  get: async (req, res) => {
    allUsers_fc(req, res, User);
  },
  create: async (req, res) => {
    create_fc(User, req, res);
  },
  login: async (req, res) => {
    login_fc(User, req, res);
  },
  protect: async (req, res, next) => {
    protect_fc(User, req, res, next);
  },
  update: async (req, res) => {
    update_fc(User, req, res);
  },
  getFriends: async (req, res) => {
    getFriends_fc(req, res, User);
  },
  getRequests: async (req, res) => {
    getRequests_fc(req, res, User, FriendRequest);
  },
  getMessages: async (req, res) => {
    getMessages_fc(req, res, Message);
  },
  getChatList: async (req, res) => {
    getChatList_fc(req, res, ChatRoom, User);
  },
  startVoiceCall: async (req, res) => {
    startVoiceCall_fc(req, res, AudioCall, User); 
  }
};

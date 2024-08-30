const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");
const Message = require("../models/messageModel");
const Blocked = require("../models/blockedUserModel");

//@description     Create or fetch One to One Chat
//@route           POST /api/chat/
//@access          Protected
const blocked = asyncHandler(async (req, res) => {
    const { blockerId, blockedId } = req.body;

  // Check if the combination of blockerId and blockedId already exists
  const existingBlocked = await Blocked.findOne({ blocker: blockerId, blocked: blockedId });

  if (existingBlocked) {
    // If the combination already exists, send an error response
    return res.status(400).send({ error: 'User is already blocked by you.' });
  }

  const blockedUser = new Blocked({
    blocker: blockerId,
    blocked: blockedId,
  });

  try {
    await blockedUser.save();
    res.status(200).send({ message: 'User blocked successfully.' });
  } catch (error) {
    res.status(500).send({ error: 'An error occurred while blocking the user.' });
  }
});

const unblocked = asyncHandler(async (req, res) => {
    const { blockerId, blockedId } = req.body;
    
    try {
        const blockedData = await Blocked.findOne({ blocker: blockerId, blocked: blockedId });
    console.log(blockedData);
    if (blockedData) {
        await Blocked.deleteOne({ _id: blockedData._id });
        res.status(200).send({ message: 'User unblocked successfully.' });
      } else {
        res.status(404).send({ error: 'Matching record not found.' });
      }
    } catch (error) {
      res.status(500).send({ error: 'An error occurred while unblocking the user.' });
    }
});

const fetchBlockedUsers = asyncHandler(async (req, res) => {
    const { blockerId } = req.params;
    console.log(blockerId,"blocker id",);

  try {
    const blockedUsers = await Blocked.find({ blocker: blockerId }).populate('blocked');
    res.status(200).send(blockedUsers);
    console.log(blockedUsers)
  } catch (error) {
    res.status(500).send({ error: 'An error occurred while retrieving blocked users.' });
  }
});




module.exports = {
  blocked,unblocked,fetchBlockedUsers
};


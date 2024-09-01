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
  console.log(blockerId,blockedId+"blockUserCOntroller unblocked")

  // Check if the combination of blockerId and blockedId already exists
  try {
    const blockedData = await Blocked.findOne({ blocker: blockerId, blocked: blockedId });
    // console.log(blockedData);
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


const checkBlockStatus = asyncHandler(async (req, res) => {
  const { blocked, blocker} = req.query;
 
  console.log(blocker,blocked)

  if (!blocked || !blocker) {
    return res.status(400).json({ error: 'Missing chatId or blocked parameter' });
  }

  try {
    let blockedUserIdsArray = [];
    // const chat = await Chat.findOne({ _id: chatId })
    // // console.log(chat);
    // if (chat && chat.users) {
    //   blockedUserIdsArray = chat.users.filter(userId => userId.toString() !== blocker.toString());
    //   console.log('Blocked User IDs:', blockedUserIdsArray);
    //   console.log(" ----"+blockedUserIdsArray[0] );
    // }
    // console.log("hellodfdd"+chatId)
   
    // if (blockedUserIdsArray.length > 0) {
      // console.log("hello"+chatId)
      // const block = await Blocked.findOne({ blocker: blocker, blocked: blockedUserIdsArray[0] });
      const block = await Blocked.findOne({ blocker: blocker, blocked: blocked });
      if (block) {
        console.log("hello")
          return res.json({ isBlocked: true });
      } else {
          return res.json({ isBlocked: false });
      }
  // } else {
  //     return res.json({ isBlocked: false, message: 'No users to block' });
  // }
  } catch (err) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

const fetchBlockedUsers = asyncHandler(async (req, res) => {
  const { blockerId } = req.params;
  console.log(blockerId, "blocker id",);

  try {
    const blockedUsers = await Blocked.find({ blocker: blockerId }).populate('blocked');
    res.status(200).send(blockedUsers);
    console.log(blockedUsers)
  } catch (error) {
    res.status(500).send({ error: 'An error occurred while retrieving blocked users.' });
  }
});




module.exports = {
  blocked, unblocked, checkBlockStatus, fetchBlockedUsers
};


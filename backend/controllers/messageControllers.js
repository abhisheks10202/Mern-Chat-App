const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");

//@description     Get all Messages
//@route           GET /api/Message/:chatId
//@access          Protected
const allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//@description     Create New Message
//@route           POST /api/Message/
//@access          Protected
const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    var message = await Message.create(newMessage);

    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const deleteForMe = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const messageId = req.params.messageId;

  try {
    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    message.deletedFor.push(userId);
    await message.save();

    res.json({ success: true, message: "Message deleted for you" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

const deleteForEveryOne = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const messageId = req.params.messageId;
  console.log(userId.toString(), messageId);

  try {
    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }
    console.log(message.sender._id.toString());

    if (message.sender._id.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ error: "You can only delete your own messages" });
    }
    const deletedMessage = await Message.findByIdAndDelete(messageId);
    message.deletedForEveryone = true;
    await message.save();
    console.log("chatid=", message.chat._id);

    // Notify all users in the chat about the deletion
    // const chat = await Chat.findById(message.chat._id).populate("users");
    // chat.users.forEach((user) => {
    //   console.log("success ");
    //   socket.in(user._id).emit("message deleted", messageId);
    // });

    res.json({ success: true, message: "Message deleted for everyone" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = { allMessages, sendMessage, deleteForMe, deleteForEveryOne };

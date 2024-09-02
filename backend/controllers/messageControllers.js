const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");
const Blocked = require("../models/blockedUserModel");

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
  const { content, chatId,receiverUserIds} = req.body;
  const audioFile = req.file; // Assuming you're using middleware like 'multer' to handle file uploads
  console.log(audioFile+"audio file")
console.log(chatId+" send message"+ chatId._id+" chatID._id"+receiverUserIds[0]._id)

  if (!content || !chatId||!receiverUserIds) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }
 
  
  let newMessage = {
    sender: req.user._id,
    content: content || '', // Allow content to be empty if only audio is sent
    chat: chatId,
    receiver: receiverUserIds,
  };
   //for reverse isBlock status check (is receiver blocked me or not)
   
  // Handle audio file upload
  if (audioFile) {
    newMessage.audioUrl = audioFile.path; // or the URL based on your storage solution
  }

  try {
    var message = await Message.create(newMessage);

    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });
    for (const receiverUserId of receiverUserIds) {
      // Check if the receiverUserId matches any receiver in the message model
      console.log(chatId.isGroupChat+"chat id")
      if(!chatId.isGroupChat)
        {
         const block = await Blocked.findOne({ blocker: receiverUserIds[0]._id , blocked:req.user._id });
         console.log(block+" isBlocked")
         if (block) {
          message.MessageDeletedFor.push(receiverUserIds[0]._id);
          await message.save();
        } 
         
        }
        console.log("yes")
        // Find the chat and remove the chatVisible field for the receiver
       
        await Chat.updateMany(
          { _id: chatId },
          { $pull:{ chatNotVisibleTo: receiverUserId._id, chatDeletedFor: receiverUserId._id } },
          
        );
        console.log("yhin dikkat h")
      }

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
    console.log(message.MessageDeletedFor.includes(userId))
    console.log(userId);
    
    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }
    else if(message&&message.MessageDeletedFor.includes(userId))
    {
      return res
      .status(403)
      .json({ error: "Message already deleted for you" });
    }

    message.MessageDeletedFor.push(userId);
    await message.save();

    res.json({ success: true, message: "Message deleted for you" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});


// const deleteForMe = asyncHandler(async (req, res) => {
//   const userId = req.user._id;
//   const messageId = req.params.messageId;

//   try {
//     const message = await Message.findById(messageId);
//     if (!message) {
//       return res.status(404).json({ error: "Message not found" });
//     }

//     const chat = await Chat.findById(message.chat._id);
//     if (!chat) {
//       return res.status(404).json({ error: "Chat not found" });
//     }

//     const isLatestMessage =
//       chat.latestMessage && chat.latestMessage._id.toString() === messageId;
//     const isLastMessage = await Message.findOne({ "chat._id": chat._id })
//       .sort({ createdAt: -1 })
//       .exec();

//     if (isLastMessage && isLastMessage._id.toString() === messageId) {
//       chat.latestMessage = null;
//     } else if (isLatestMessage) {
//       const previousMessage = await Message.findOne({
//         "chat._id": chat._id,
//         _id: { $ne: messageId },
//         MessageDeletedFor: { $ne: userId },
//       })
//         .sort({ createdAt: -1 })
//         .exec();
//       chat.latestMessage = previousMessage ? previousMessage._id : null;
//     }

//     await chat.save();

//     message.MessageDeletedFor.push(userId);
//     await message.save();

//     res.json({ success: true, message: "Message deleted for you" });
//   } catch (error) {
//     res.status(500).json({ error: "Server error" });
//   }
// });



const deleteForEveryOne = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const messageId = req.params.messageId;
  // console.log(userId.toString(), messageId);

  try {
    const message = await Message.findById(messageId);
    if (!message||message.MessageDeletedForEveryone===true ) {
      return res.status(404).json({ error: "Message not found or already deleted" });
    }
    // console.log(message.sender._id.toString());

    if (message.sender._id.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ error: "You can only delete your own messages" });
    }
    message.MessageDeletedForEveryone = true;
    message.content = "Deleted for everyone";
    await message.save();
   
    res.json({ success: true, message: "Message deleted for everyone" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});


module.exports = { allMessages, sendMessage, deleteForMe, deleteForEveryOne };
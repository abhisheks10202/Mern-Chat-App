const Chat = require("../models/chatModel");
const User = require("../models/userModel");
const Message = require("../models/messageModel");

const asyncHandler = require("express-async-handler");
require('dotenv').config();
const axios = require('axios');

const apiKey = process.env.VEXT_API_KEY;
const channelToken = process.env.CHANNEL_TOKEN;


const payload = asyncHandler(async (req, res) => {
  const url = `https://payload.vextapp.com/hook/OKPIG3T2H8/catch/${channelToken}`;
  const headers = {
      'Content-Type': 'application/json',
      'Apikey': `Api-Key ${apiKey}`
  };
  const info = {
    loggedUserId: req.body.loggedUser,
    chatId:req.body.chatId
  }
  const data = {
    payload: req.body.message,

  };

  try {
    const response = await axios.post(url, data, { headers });
        res.json(response.data);


    //save the sender loggedi user message
    const content=data.payload;
    const chatId=info.chatId;

    

    if (!content || !chatId) {
      console.log("Invalid data passed into request");
      
    }

    var newMessage = {
      sender: info.loggedUserId,
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

      await Chat.findByIdAndUpdate(chatId, { latestMessage: message });

      // res.json(message);
    } catch (error) {
      // res.status(400);
      throw new Error(error.message);
    }

    //now treat open api response as contnent for sender AskChatBot
    
    var newMessageForResponse = {
      sender:"66c5a7d94b2ecb789979b40c",
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

      await Chat.findByIdAndUpdate(chatId, { latestMessage: message });

      // res.json(message);
    } catch (error) {
      // res.status(400);
      throw new Error(error.message);
    }


    // res.json(response.data);
    console.log(info.loggedUserId);
    console.log(chatId);





  } catch (error) {
    res.status(error.response ? error.response.status : 500).send(error.message);
  }
});

module.exports = payload;
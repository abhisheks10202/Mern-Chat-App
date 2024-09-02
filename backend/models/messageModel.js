const mongoose = require("mongoose");

const messageSchema = mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User",  required: true  },
    receiver: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    content: { type: String, trim: true,  required: false },
    audioUrl: { // New field to store audio files
      type: String,
      required: false // Optional if audio isn't present
    },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    MessageDeletedFor: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // This can be an array of user IDs
    MessageDeletedForEveryone: { type: Boolean, default: false },
  },

  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;

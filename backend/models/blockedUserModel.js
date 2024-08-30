const mongoose = require('mongoose');

const blockedUserModel = new mongoose.Schema({
  blocker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  blocked: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});



const Blocked = mongoose.model("Blocked", blockedUserModel);

module.exports = Blocked;
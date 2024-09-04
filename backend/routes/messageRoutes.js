const express = require("express");
const {
  allMessages,
  sendMessage,
  deleteForMe,
  deleteForEveryOne,
} = require("../controllers/messageControllers");
const { protect } = require("../middleware/authMiddleware");
const { upload } = require('../config/cloudinaryConfig'); // Adjust the path as necessary

const router = express.Router();

router.route("/:chatId").get(protect, allMessages);
router.route("/").post(protect, upload.fields([{ name: 'audio', maxCount: 1 }, { name: 'file', maxCount: 1 }]),  (req, res, next) => {
  console.log('Files:', req.files);
  // Check both audio and file uploads
  if (req.files.audio) {
      console.log('Audio file received:', req.files.audio[0]);
  } else {
      console.error('No audio file uploaded');
  }
  next(); // Move to sendMessage handler
},sendMessage);

router.route("/:messageId/delete-for-me").delete(protect, deleteForMe);
router
  .route("/:messageId/delete-for-everyone")
  .delete(protect, deleteForEveryOne);

module.exports = router;

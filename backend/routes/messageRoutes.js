const express = require("express");
const {
  allMessages,
  sendMessage,
  deleteForMe,
  deleteForEveryOne,
} = require("../controllers/messageControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/:chatId").get(protect, allMessages);
router.route("/").post(protect, sendMessage);
router.route("/:messageId/delete-for-me").delete(protect, deleteForMe);
router
  .route("/:messageId/delete-for-everyone")
  .delete(protect, deleteForEveryOne);

module.exports = router;

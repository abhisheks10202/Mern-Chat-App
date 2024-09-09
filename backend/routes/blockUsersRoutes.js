const express = require("express");
const {
  blocked,unblocked,fetchBlockedUsers,
  checkBlockStatus
} = require("../controllers/blockUserControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/check-block-status").get(protect, checkBlockStatus);
router.route("/").post(protect, blocked);
router.route("/unblock").delete(protect, unblocked);

router.route("/:blockerId").get(protect, fetchBlockedUsers);


module.exports = router;

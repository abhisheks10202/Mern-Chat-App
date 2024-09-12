const express = require("express");
const router = express.Router();
const {
  blocked,unblocked,fetchBlockedUsers,
  checkBlockStatus
} = require("../controllers/blockUserControllers");
const { protect } = require("../middleware/authMiddleware");



const rateLimiter = require('../middleware/rateLimiterMiddleware'); 
router.route("/check-block-status").get(protect, checkBlockStatus);
router.route("/").post(rateLimiter({secondWindow:120,allowedHits:1}),protect, blocked);
router.route("/unblock").delete(rateLimiter({secondWindow:120,allowedHits:1}),protect, unblocked);

router.route("/:blockerId").get(protect, fetchBlockedUsers);


module.exports = router;

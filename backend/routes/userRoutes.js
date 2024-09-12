const express = require("express");
const {
  registerUser,
  authUser,
  allUsers,
} = require("../controllers/userControllers");
const { protect } = require("../middleware/authMiddleware");


const redisClient = require('../config/redisConfig'); 
const rateLimiter = require('../middleware/rateLimiterMiddleware'); 

const router = express.Router();

router.route("/").get(protect, allUsers);

router.route("/").post(rateLimiter({secondWindow:120,allowedHits:5}),registerUser);
router.route("/login").post(rateLimiter({secondWindow:120,allowedHits:1}), authUser)
module.exports = router;

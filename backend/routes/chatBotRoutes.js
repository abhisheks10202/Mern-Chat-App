const express = require('express');
const payload = require("../controllers/chatBotControllers");
const router = express.Router();

router.route("/send-payload").post(payload);



module.exports = router;

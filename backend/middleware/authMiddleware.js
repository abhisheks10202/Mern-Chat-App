const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");
const asyncHandler = require("express-async-handler");

const protect = asyncHandler(async (req, res, next) => {
  let token;
// console.log(req.headers.authorization+" 7th line token from ")
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
    
  ) {
    // console.log(req.headers.authorization+" 13th line token from ")
    try {
      token = req.headers.authorization.split(" ")[1];
      // console.log(token+" 16th line token from ")

      //decodes token id
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // console.log(decoded+" decoded");

      req.user = await User.findById(decoded.id).select("-password");
      // console.log(req.user);

      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

module.exports = { protect };

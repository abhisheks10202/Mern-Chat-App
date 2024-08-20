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
    const data = {
        payload: req.body.message
    };

    try {
        const response = await axios.post(url, data, { headers });
        res.json(response.data);
        // console.log(response.data)
    } catch (error) {
        res.status(error.response ? error.response.status : 500).send(error.message);
    }
  });
  
  module.exports = payload;
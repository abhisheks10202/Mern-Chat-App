// redisConfig.js
const redis = require('redis');
const { createClient } =require('redis');
// Load sensitive information from environment variables
const REDIS_USERNAME = process.env.REDIS_USERNAME || "default"; // Set default or load from environment variables
const REDIS_PASSWORD = process.env.REDIS_PASSWORD||'ctRrQnG64qShD6Po3J6cEIgzpeQJ1TpE' ;
const REDIS_HOST = process.env.REDIS_HOST || 'redis-11398.c263.us-east-1-2.ec2.redns.redis-cloud.com';
const REDIS_PORT = process.env.REDIS_PORT || 11398;
console.log("hello")
const client=createClient({
    url: `redis://${REDIS_USERNAME}:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}`
  });
//   console.log(REDIS_USERNAME+" "+process.env.REDIS_PASSWORD)
client.on('error', (err) => {
    console.error('Redis Client Error', err);
});
(async () => {
    await client.connect();
    console.log(" Redis connected")
})();
module.exports = client; // Export the client for use in other files
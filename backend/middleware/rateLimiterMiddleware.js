
const redis=require('../config/redisConfig');

function rateLimiter({secondWindow,allowedHits}){
    return async function(req, res, next)  {
        const ip=(req.headers['x-forwarded-for']||req.connection.remoteAddress);
        // Construct a unique key using the endpoint and IP address
        const endpoint = req.originalUrl; 
        console.log(endpoint+" endpoint")
        const key = `${endpoint}:${ip}`;
        // Increment the request count for the constructed key
        const requests = await redis.incr(key);
        // const requests=await redis.incr(ip);
        let ttl;
        if(requests==1)
        {
            await redis.expire(key,secondWindow);
            ttl=secondWindow;
        }
       else{
        ttl=await redis.ttl(key);
       }
       if(requests>allowedHits)
       {
        return res.status(429).json({
           error: "Rate Limit Exceeded",
            message: "You have exceeded the maximum number of requests allowed. Please try again later.",
            callsInAMinute:requests,
            ttl:ttl
    
        })
       }
       else{
        req.requests=requests;
        req.ttl=ttl;
       next();
       }
          
    };
}

module.exports = rateLimiter; // Export the rate limiter middleware
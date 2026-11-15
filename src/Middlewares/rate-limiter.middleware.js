import { rateLimit , ipKeyGenerator} from "express-rate-limit";
import { TooManyRequestsException } from "../common/Utils/Errors/exception.error.js";
import axios from "axios";
import RedisStore from "rate-limit-redis";
import { redisClient } from '../common/Clients/redis.client.js';
function getIPDetails (ip){
  return axios.get(`http://ip-api.com/json/${ip}`)
}
export const CreaterateLimiter = () => rateLimit({
  windowMs: 1 * 60 * 1000, 
  limit: async (req)=>{
    const {data:{countryCode}}  = await getIPDetails(req.headers['x-forwarded-for'])

    let max ;
    switch (countryCode) {
      case 'EG':
        max = 10
        break;
    
      case 'US':
        max = 4
        break;
    
      default:
        max = 30
        
    }



return max


  },
  standardHeaders: false, 
  legacyHeaders: false, 
 requestPropertyName:'rateLimiterInfo',
 skipFailedRequests:true,
  handler: (req, res, next) => {
    next(new TooManyRequestsException("Many requests", null, "RATE_LIMITER"));
  },
  keyGenerator : (req,res)=>{
    const ip = ipKeyGenerator(req.headers['x-forwarded-for'])
    return `${ip}_${req.url}`
  },
 store: new RedisStore({
  sendCommand: async (...args) => {
    const data = await redisClient.sendCommand(args);
    return data;
  }
}),
});

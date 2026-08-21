/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */


import { log } from "console";
import { REDIS_HOST, REDIS_URL } from "./env";
import Redis from 'ioredis'
const redisClient =new Redis(REDIS_URL!,
    {tls : {servername : REDIS_HOST}}
)

export { redisClient }
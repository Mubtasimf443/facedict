/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import { createClient, RedisClientType } from "redis";
import { REDIS_URL } from "./env";

export let redisClient :RedisClientType;

export default async function initRedis() :Promise<void> {
    redisClient = createClient({
        url :REDIS_URL 
    });
    redisClient.on('error' , error => console.log(error));

    await redisClient.connect();
    console.log('Redis connected successfully.');
}
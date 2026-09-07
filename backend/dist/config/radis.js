"use strict";
/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisClient = void 0;
const env_1 = require("./env");
const ioredis_1 = __importDefault(require("ioredis"));
const redisClient = new ioredis_1.default(env_1.REDIS_URL, { tls: { servername: env_1.REDIS_HOST } });
exports.redisClient = redisClient;

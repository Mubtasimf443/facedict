"use strict";
/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = userMiddleWare;
const radis_1 = require("../config/radis");
require("express");
const zod_1 = __importDefault(require("zod"));
async function userMiddleWare(req, res, next) {
    try {
        let bearerAccessToken = req.cookies.login_session;
        if (!bearerAccessToken)
            return res.status(401).json({ error: { message: 'Bearer Access Token is required' } });
        const authSessionSchema = zod_1.default
            .string()
            .length(160, { message: 'Auth session token must be exactly 160 characters long' })
            .regex(/^[0-9a-f]{160}$/, { message: 'Auth session token must be a valid hex string' });
        let user = await radis_1.redisClient.get(`login_session:${authSessionSchema.parse(bearerAccessToken)}`);
        if (user === null) {
            res.status(401).json({ error: { message: 'User is logged Out' } });
        }
        if (typeof user === 'string')
            req.user_id = JSON.parse(user).id;
        return next();
    }
    catch (error) {
        console.error('user middleware error \n', error);
        res.status(401).json({
            errorType: 'user middleware error',
            error,
            data: null,
            success: false
        });
    }
}

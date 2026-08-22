/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import { NextFunction, Request, Response } from "express";
import { redisClient } from "../config/radis";
import "express";
import z from "zod";

declare global {
  namespace Express {
    interface Request {
      user_id?: number;
    }
  }
}

export default async function userMiddleWare(req : Request , res : Response, next: NextFunction) {
    try {
        let bearerAccessToken = req.headers['authorization'];
        if (!bearerAccessToken) return res.status(401).json({ error: { message: 'Bearer Access Token is required' } });
        if (bearerAccessToken.startsWith('bearer') === false) return res.status(401).json({ error: { message: 'Bearer Access Token is required' } });
        let token = bearerAccessToken.replace('bearer', '').trim();
        if (!token) return res.status(401).json({ error: { message: 'Bearer Access Token is required' } });

        const authSessionSchema = z
            .string()
            .length(160, { message: 'Auth session token must be exactly 160 characters long' })
            .regex(/^[0-9a-f]{160}$/, { message: 'Auth session token must be a valid hex string' });
        let user = await redisClient.get(`login_session:${authSessionSchema.parse(token)}`)
        if (user === null) {
            res.status(401).json({ error : { message : 'User is logged Out'}})
        }
        if (typeof user === 'string') req.user_id = JSON.parse(user).id;
        return next();
    } catch (error) {
        console.error('user middleware error \n', error);
        res.status(500).json({
            errorType: 'user middleware error',
            error,
            data: null,
            success: false
        })
    }
}
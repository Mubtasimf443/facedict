/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import { Request, Response } from "express";
import AuthService from "../services/auth.service";
import crypto from 'crypto'
import { redisClient } from "../config/radis";
import generateOtp from "../utils/core/GenerateOtp";
import z, { success } from "zod";
import sendVerificationOTP from "../utils/mails/auth.mails";

export default class AuthController {
    // static async SignUp(req: Request, res: Response): Promise<Response> {
     
    // }

    // static async SignUpOtpVerification(req : Request , res : Response) :Promise<Response> {
     
    // }

    
    static Login(req: Request, res: Response): Response {
        return res.status(200).json({});
    }

    static Logout(req: Request, res: Response): Response {
        return res.status(200).json({})
    }
}



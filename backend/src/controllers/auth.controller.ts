/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import { Request, Response } from "express";
import AuthService from "../services/auth.service";
import crypto from 'crypto'
import { redisClient } from "../config/radis";
import generateOtp from "../utils/core/GenerateOtp";
import z, { success, ZodError } from "zod";
import sendVerificationOTP from "../utils/mails/auth.mails";
import { log } from "console";
import { AsyncLocalStorage } from "async_hooks";
import db from "../config/db";
import { usersTable } from "../drizzle/schema";
import { eq } from "drizzle-orm";

export default class AuthController {
    static async SignUp(req: Request, res: Response): Promise<Response> {
        try {
            let password = req.body.password?.trim();
            if (!password || password?.length < 8 || password?.length > 32 ) return res.status(400).json({ success : false , data : null , error : {message : 'Invalid password '}});
            let {salt , hashed_password } = AuthService.hashPassword(password);
            let {error , data , success } = AuthService.validateSignUpData({...req.body, hashed_password , salt});
            if (error || !data || !success)  {
                return res.status(400).json({ success : false , data : null , error});
            }
            let existingUser = await db.select().from(usersTable).where(eq(usersTable.email , data.email)).limit(1)
            if  (existingUser.length > 0 ) {
                return res.status(400).json({ success : false , data : null , error : {message : 'This email is registered, please sign in with the email'}});
            }
            let suvs = AuthService.generate_auth_session();
            let otp = generateOtp();
            let payload = JSON.stringify({ ...data, otp });
            let isOk = await redisClient.set(`sign_up_verification_session:${suvs}`,payload, 'EX' , 65 );
            if (isOk != 'OK') {
                throw 'Redis session setup failed'
            }
            let isOtpSend =await sendVerificationOTP(data.email , otp);
            if (!isOtpSend ) throw " failed send otp by mail";

            return res.status(200).json({ success: true, data: { session: suvs }, error: null });
        } catch (error) {
            console.error({error});
            return res.status(500).json({ success : false , data : null , error })
        }
    }

    static async SignUpOtpVerification(req : Request , res : Response) :Promise<Response> {
        try {
            const authSessionSchema = z
                .string()
                .length(160, { message: 'Auth session token must be exactly 160 characters long' })
                .regex(/^[0-9a-f]{160}$/, { message: 'Auth session token must be a valid hex string' });
            
            let userData :any=await redisClient.get(`sign_up_verification_session:${authSessionSchema.parse(req.body.session)}`);
            if (!userData) {
                return res.status(400).json({ data: null, error: { message: 'Signup sesssion has expired' }, success: false });
            }
            userData = JSON.parse(userData);
            let user =await db.insert(usersTable)
                .values({ ...userData, is_verified: true, is_active: true })
                .$returningId();
            log({user});

            let login_session = AuthService.generate_auth_session();
            redisClient.set(`login_session:${login_session}`, JSON.stringify({ id: user[0].id }), 'EX', 7 * 24 * 60 * 60);
            return res.status(200).json({ success: true, data: { login_session }, error: null });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success : false , data : null , error })
        }
    }

    
    static async Login(req: Request, res: Response): Promise<Response> {
        try {
            let data = AuthService.validateLoginInfo(req.body);
            let user =await db.select().from(usersTable).where(eq(usersTable.email , data.email));
            if (user.length !== 1) {
                return res.status(400).json({ error: { message: "Please create a account" }, data: null, success: false });
            }
            let isPassworMatch = AuthService.comparePassword(data.password , user[0].hashed_password , user[0].salt);
            if (!isPassworMatch) {
                return res.status(400).json({
                    success : false ,
                    data : null ,
                    error : {
                        message: 'Passsword is invalid'
                    }
                })
            }
            let login_session = AuthService.generate_auth_session();
            redisClient.set(`login_session:${login_session}`, JSON.stringify({ id: user[0].id }), 'EX', 7 * 24 * 60 * 60);
            return res.status(200).json({ success: true, data: { login_session }, error: null });
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({ error, data: null, success: false })
            }
            console.error(error);
            return res.status(500).json({ success : false , data : null , error })
        }
       
    }

    static async Logout(req: Request, res: Response): Promise<Response> {
        try {
            const authSessionSchema = z
                .string()
                .length(160, { message: 'Auth session token must be exactly 160 characters long' })
                .regex(/^[0-9a-f]{160}$/, { message: 'Auth session token must be a valid hex string' });
            await redisClient.del(`login_session:${authSessionSchema.parse(req.body.session)}`)
            return res.status(200).json({ success: true, data: null, error: null })
        } catch (error) {
            console.error({error})
            return res.status(500).json({error})
        }
    }
}



/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import { Request, Response } from "express";
import AuthService from "../services/auth.service";

export default class AuthController {
    static SignUp(req: Request, res: Response): Response {
        try {
            let { data, success, error } = AuthService.validateSignUpData(req.body);

            if (error) {
                return res.status(400).json({ 
                    success :false ,
                    error,
                    data : null
                })
            }

            
            return res.status(200).json({})
        } catch (error) {
            console.log(error);
            return res.status(200).json({ success: false, error: error, data : null })
        }
    }
    static Login(req: Request, res: Response): Response {
        return res.status(200).json({});
    }

    static Logout(req: Request, res: Response): Response {
        return res.status(200).json({})
    }
}



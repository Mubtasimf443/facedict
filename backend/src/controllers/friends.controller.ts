/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import { Request, Response } from "express";

export default class friendsController {
    static async sendFriendshipRequest(req: Request, res: Response): Promise<Response> {
        try {

            return res.status(200).json({})
        } catch (error) {
            console.error(error);
            return res.status(200).json({ error, success: false, data: null })
        }
    }

    static async confirmFriendshipRequest(req: Request, res: Response): Promise<Response> {
        try {

            return res.status(200).json({})
        } catch (error) {
            console.error(error);
            return res.status(200).json({ error, success: false, data: null })
        }
    }

    static async denyFriendshipRequest(req: Request, res: Response): Promise<Response> {
        try {

            return res.status(200).json({})
        } catch (error) {
            console.error(error);
            return res.status(200).json({ error, success: false, data: null })
        }
    }
    
    static async removeFriendshipRequest(req: Request, res: Response): Promise<Response> {
        try {

            return res.status(200).json({})
        } catch (error) {
            console.error(error);
            return res.status(200).json({ error, success: false, data: null })
        }
    }
}
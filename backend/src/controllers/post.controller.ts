/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import { Request, Response } from "express";

export default class postController {
    static async getFeed (req: Request, res : Response) :Promise<Response> {
        try {

            return res.status(200).json({})
        } catch (error) {
            console.error(error);
            return res.status(200).json({ error, success: false , data : null })
        }
    }

      static async createPost (req: Request, res : Response) :Promise<Response> {
        try {
            
            return res.status(200).json({})
        } catch (error) {
            console.error(error);
            return res.status(200).json({ error, success: false , data : null })
        }
    }
}
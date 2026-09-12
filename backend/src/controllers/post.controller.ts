/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import { Request, Response } from "express";
import PostService from "../services/post.service";
import db from "../config/db";
import { postTables } from "../drizzle/schema";

export default class postController {
    static async getFeed (req: Request, res : Response) :Promise<Response> {
        try {

            return res.status(200).json({})
        } catch (error) {
            console.error(error);
            return res.status(200).json({ error, success: false , data : null })
        }
    }

      static async createPost(req: Request, res : Response) :Promise<Response> {
        try {
            let { success, data, error } = PostService.validateCreatePostData(req.body);
            if ( !data || error) {
                return res.status(400).json({ error, success: false, data: null })
            }
            let ids = await db.insert(postTables)
                .values({
                     caption: data.caption,
                    images: data.images,
                    tags: data.tags,
                    interest: data.interest,
                    author: req.user_id!
                })
                .$returningId();
            return res.status(200).json({
                error: null, 
                success: true, 
                data: { id: ids[0].id } 
            })
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error, success: false , data : null })
        }
    }
}
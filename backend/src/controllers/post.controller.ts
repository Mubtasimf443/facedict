/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import { Request, Response } from "express";
import PostService from "../services/post.service";
import db from "../config/db";
import { postTables, usersTable } from "../drizzle/schema";
import { and, eq, gte, sql } from "drizzle-orm";
import { count } from "drizzle-orm";
import z, { success } from "zod";

export default class postController {
    static async getFeed (req: Request, res : Response) :Promise<Response> {
        try {
            let page = z.number().int().nonnegative().default(0).parse(Number(req.query.page || 0));
            // const postCount =( await db
            //     .select({ count: count() })
            //     .from(postTables)
            //     .where(
            //         and(gte(postTables.createdAt, new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)))
            //     ))[0].count;
            let posts = await db
                .select({
                    caption: postTables.caption,
                    images: postTables.images,
                    id: postTables.id,
                    likes: postTables.likes,
                    comments: postTables.comments,
                    userName: usersTable.name,
                    userId: usersTable.id,
                    userImage: usersTable.avatar,
                })
                .from(postTables)
                .where(
                    and(gte(postTables.createdAt, new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)))
                )
                .leftJoin(usersTable, eq(postTables.author, usersTable.id));
                
            return res.status(200).json({ data: { posts } })
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error, success: false , data : null })
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

    static async getUserUplaodedPost(req : Request, res : Response) {
        try {
            let page = z.number().int().min(0).max(500).optional().default(0).parse(Number(req.query.page));
            let userId= z.number().int().min(1).parse(Number(req.params.userId));
            let postCount = (await db
                .select({ count: count() })
                .from(postTables)
                .where(eq(postTables.author, userId)))[0].count;
            
            
            let totalPages = postCount <= 10 ? 1 : Math.floor(postCount / 10);
            let posts = await db
                .select({
                    caption : postTables.caption,
                    images : postTables.images,
                    id : postTables.id,
                    likes : postTables.likes,
                    comments : postTables.comments
                })
                .from(postTables)
                .where(eq(postTables.author, userId))
                .limit(10)
                .offset(page * 10);

            return res.status(200).json({ 
                totalPages,
                currentPage: page < totalPages ? page : totalPages ,
                posts
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error, data: null, success: false })
        }
    }

    static async getLikedPost(req : Request, res : Response)  {
        try {
            let page = z.number().int().min(0).max(500).optional().default(0).parse(Number(req.query.page));
            let userId= z.number().int().min(1).parse(Number(req.params.userId));
             let postCount = (await db
                .select({ count: count() })
                .from(postTables)
                .where(sql`JSON_CONTAINS(${postTables.likes}, JSON_OBJECT('userId', ${userId}))`))[0].count;
            
            
            let totalPages = postCount <= 10 ? 1 : Math.floor(postCount / 10);
            let posts = await db
                .select(
                    {
                        caption: postTables.caption,
                        images: postTables.images,
                        id: postTables.id,
                        likes: postTables.likes,
                        comments: postTables.comments,
                        userName: usersTable.name,
                        userId: usersTable.id,
                        userImage: usersTable.avatar
                    }
                )
                .from(postTables)
                .where(sql`JSON_CONTAINS(${postTables.likes}, JSON_OBJECT('userId', ${userId}))`)
                .leftJoin(usersTable, eq(postTables.author, usersTable.id))
                .limit(10)
                .offset(page * 10);

            return res.status(200).json({
                totalPages,
                currentPage: page < totalPages ? page : totalPages,
                posts
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error, data: null, success: false })  
        }
    }

    static async likePost(req : Request, res : Response)  {
        try {
            let userId= req.user_id!;
            let postId= z.number().int().nonnegative().parse(Number(req.params.postId));
            let post =(await db.select().from(postTables).where(eq(postTables.id , postId)).limit(1))[0];
            if (!post) {
                return res.status(400).json({ error : { message : `There is no post from postId=${postId}`}});
            }
            let isLikedBefore = post.likes!.find((data) =>data.userId === userId  );
            if (!isLikedBefore) {
                let userInfo = (await db
                    .select({ name: usersTable.name, id: usersTable.id })
                    .from(usersTable)
                    .where(eq(usersTable.id, userId))
                    .limit(1))[0];
                await db
                    .update(postTables)
                    .set({ likes: [...(post.likes || []), { userId: userInfo.id, userName: userInfo.name, time: new Date() }] })
                    .where(eq(postTables.id, postId));
                return res.status(200).json({ success: true, isLiked: true });
            }
            await db
                .update(postTables)
                .set({ likes: post.likes!.filter(likedUser => likedUser.userId !== userId) })
                .where(eq(postTables.id, postId));;
            return res.status(200).json({ success: true, isLiked: false });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error, data: null, success: false })  
        }
    }

    static async getUserPostedMedia(req : Request, res : Response)  {
        try {
            let userId= z.number().int().nonnegative().parse(Number(req.params.userId));
          
            let postImagesUnfiltered = await db
                .select({ images: postTables.images })
                .from(postTables)
                .where(eq(postTables.author , userId));
            let postImagesFiltered = [];
            
            for (let i = 0; i < postImagesUnfiltered.length; i++) {
                const {images} = postImagesUnfiltered[i];
                for (let j = 0; j < images!.length; j++) {
                    postImagesFiltered.push(images![j])
                }
            }
            return res.status(200).json({ data: {  images: postImagesFiltered }, success: true, error: null })
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error, data: null, success: false });
        }
    }
    
}
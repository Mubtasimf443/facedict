/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import { Request, Response } from "express";
import PostService from "../services/post.service";
import db from "../config/db";
import { postTables, usersTable } from "../drizzle/schema";
import { and, desc, eq, gt, gte, inArray, like, ne, or, sql } from "drizzle-orm";
import { count } from "drizzle-orm";
import z, { success } from "zod";
import { redisClient } from "../config/radis";
import { getInterestSuggestion } from "../utils/core/interestAndCategories";

export default class postController {
    static async getSearchResult(req: Request, res: Response) {
        try {
            let query = z.string().min(2).max(120).trim().parse(req.query.query);
            let friends = await db
                .select({
                    name: usersTable.name,
                    id: usersTable.id,
                    avatar: usersTable.avatar
                })
                .from(usersTable)
                .where(
                    like(usersTable.name, `%${query}%`),
                );
            let posts = await db
                .select({
                    id: postTables.id,
                    caption: postTables.caption,
                    images: postTables.images,
                    likes: postTables.likes,
                    comments: postTables.comments,
                    createdAt: postTables.createdAt,
                    author: postTables.author,
                    userName: usersTable.name,
                    userId: usersTable.id,
                    userImage: usersTable.avatar
                })
                .from(postTables)
                .orderBy(
                    desc(postTables.createdAt)
                )
                .where(
                    sql`JSON_CONTAINS(${postTables.tags}, JSON_QUOTE(${query}))`
                )
                .leftJoin(usersTable, eq(postTables.author, usersTable.id));
            return res.status(200).json({ data: { friends, posts }, error: null, success: true })

        } catch (error) {
            console.error(error);
            return res.status(500).json({ error, success: false, data: null })
        }
    }
    static async getFeed(req: Request, res: Response): Promise<Response> {
        try {
            let page = z.number().int().nonnegative().default(0).parse(Number(req.query.page || 0));
            let postSession = await redisClient.get(`post_session:${req.user_id!}`);
            if (!postSession) {
                let userInfo = (await db
                    .select({ 
                        friends : usersTable.friends,
                        following : usersTable.following,
                        interest : usersTable.interest
                    })
                    .from(usersTable)
                    .where(eq(usersTable.id, req.user_id!))
                    .limit(1))[0];
                if (!userInfo) {
                    return res.status(400).json({ error: { message: 'No Account was found ' } })
                }
                let interest = [...new Set([...userInfo.interest!, ...getInterestSuggestion(userInfo.interest!)])];

                let posts = await db
                    .select({
                      id : postTables.id
                    })
                    .from(postTables)
                    .where(
                        and(
                            or(
                                sql`JSON_OVERLAPS(${postTables.interest}, ${JSON.stringify(interest)})`,
                                inArray(postTables.author, [...new Set([...userInfo.following!, ...userInfo.friends!])]),
                                sql`JSON_OVERLAPS(${postTables.likes}, ${JSON.stringify([new Set([...userInfo.following!, ...userInfo.friends!])])})`
                            ),
                            gt(postTables.createdAt, new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
                        )
                    )
                    .orderBy(
                        desc(postTables.createdAt)
                    )
                    .limit(1500);
                
            }
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
                // .where(
                //      inArray(postTables.author , JSON.parse())
                // )
                .orderBy(
                    desc(postTables.createdAt)
                )
            return res.status(200).json({ data: { posts: [] } })
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error, success: false, data: null })
        }
    }

    static async createPost(req: Request, res: Response): Promise<Response> {
        try {
            let { success, data, error } = PostService.validateCreatePostData(req.body);
            if (!data || error) {
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
            return res.status(500).json({ error, success: false, data: null })
        }
    }

    static async getUserUplaodedPost(req: Request, res: Response) {
        try {
            let page = z.number().int().min(0).max(500).optional().default(0).parse(Number(req.query.page));
            let userId = z.number().int().min(1).parse(Number(req.params.userId));
            let postCount = (await db
                .select({ count: count() })
                .from(postTables)
                .where(eq(postTables.author, userId)))[0].count;


            let totalPages = postCount <= 10 ? 1 : Math.floor(postCount / 10);
            let posts = await db
                .select({
                    caption: postTables.caption,
                    images: postTables.images,
                    id: postTables.id,
                    likes: postTables.likes,
                    comments: postTables.comments
                })
                .from(postTables)
                .where(eq(postTables.author, userId))
                .orderBy(
                    desc(postTables.createdAt)
                )
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

    static async getLikedPost(req: Request, res: Response) {
        try {
            let page = z.number().int().min(0).max(500).optional().default(0).parse(Number(req.query.page));
            let userId = z.number().int().min(1).parse(Number(req.params.userId));
            let postCount = (await db
                .select({ count: count() })
                .from(postTables)
                .where(
                    sql`JSON_CONTAINS(${postTables.likes},${JSON.stringify(userId)})`
                ))[0].count;


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
                .where(
                   sql`JSON_CONTAINS(${postTables.likes},${JSON.stringify(userId)})`
                )
                .leftJoin(usersTable, eq(postTables.author, usersTable.id))
                .orderBy(
                    desc(postTables.createdAt)
                )
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

    static async likePost(req: Request, res: Response) {
        try {
            let userId = req.user_id!;
            let postId = z.number().int().nonnegative().parse(Number(req.params.postId));
            let post = (await db.select().from(postTables).where(eq(postTables.id, postId)).limit(1))[0];
            if (!post) {
                return res.status(400).json({ error: { message: `There is no post from postId=${postId}` } });
            }
            let isLikedBefore = post.likes!.find((data) => data === userId);
            if (!isLikedBefore) {
                await db
                    .update(postTables)
                    .set({ likes: [...(post.likes || []), req.user_id!] })
                    .where(eq(postTables.id, postId));
                return res.status(200).json({ success: true, isLiked: true });
            }
            await db
                .update(postTables)
                .set({ likes: post.likes!.filter(likedUser => likedUser !== userId) })
                .where(eq(postTables.id, postId));;
            return res.status(200).json({ success: true, isLiked: false });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error, data: null, success: false })
        }
    }

    static async getUserPostedMedia(req: Request, res: Response) {
        try {
            let userId = z.number().int().nonnegative().parse(Number(req.params.userId));

            let postImagesUnfiltered = await db
                .select({ images: postTables.images })
                .from(postTables)
                .where(eq(postTables.author, userId));
            let postImagesFiltered = [];

            for (let i = 0; i < postImagesUnfiltered.length; i++) {
                const { images } = postImagesUnfiltered[i];
                for (let j = 0; j < images!.length; j++) {
                    postImagesFiltered.push(images![j])
                }
            }
            return res.status(200).json({ data: { images: postImagesFiltered }, success: true, error: null })
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error, data: null, success: false });
        }
    }

}
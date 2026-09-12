/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import { Request, Response } from "express";
import ProfileService from "../services/profile.service";
import db from "../config/db";
import { postTables, usersTable } from "../drizzle/schema";
import { count, eq } from "drizzle-orm";

export default class ProfileController {
    static async updateProfileInfo(req : Request, res : Response) {
        try {
            let { data: result, error, success } = await ProfileService.validateProfileInfo(req.body);
            
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error, data: null, success: false })
        }
    }
    static async addUserEducation(req : Request, res : Response) {
        try {
            let validationResult =ProfileService.validateEducation(req.body);
            if (validationResult.error || !validationResult.data) {
                return res.status(400).json({ error: JSON.parse(validationResult.error.message), data: null, success: false })
            }
            let user =(await db
                .select({ education: usersTable.education })
                .from(usersTable)
                .where(eq(usersTable.id, req.user_id!))
                .limit(1))[0];
            if (!user.education) {
                await db
                    .update(usersTable)
                    .set({ education: [validationResult.data] })
                    .where(eq(usersTable, req.user_id!))
                    .limit(1);
                return res.status(200).json({ success: true, data: null, error: null })
            }
            else if (user.education.length >= 4) {
                return res.status(400).json({ success: false, error: { message: 'Only 4 education level can be added' } });
            } else {
                await db
                    .update(usersTable)
                    .set({ education: [...user.education, validationResult.data] })
                    .where(eq(usersTable, req.user_id!))
                    .limit(1);
                return res.status(200).json({ success: true, data: null, error: null })
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error, data: null, success: false })
        }
    }
    static async getUserData(req : Request, res : Response) {
        try {
            let id = req.params.id;
            if (!id || isNaN(Number(id))) return res.status(400).json({ error: { message: 'User ID is invalid' }, success: false, data: null });
            let users = await db
                .select({
                    id: usersTable.id,
                    name: usersTable.name,
                    email: usersTable.email,
                    avater: usersTable.avatar,
                    coverImage: usersTable.coverImage,
                    bio: usersTable.bio,
                    about: usersTable.about,
                    religion: usersTable.religion,
                    website: usersTable.website,
                    nationality: usersTable.nationality,
                    languages: usersTable.languages,
                    location: usersTable.location,
                    gender: usersTable.gender,
                    job: usersTable.job,
                    education: usersTable.education,
                    joined: usersTable.createdAt,
                    followers: usersTable.followers,
                    following: usersTable.following,
                    friends: usersTable.friends
                })
                .from(usersTable)
                .where(eq(usersTable.id, Number(id)))
                .limit(1);
            if (users.length === 0) return res.status(404).json({  error: { message: 'No Users exist by this id' }, success: false, data: null });
            let postsCount = (await db.select({ postCount: count() }).from(postTables).where(eq(postTables.author, Number(id))))[0].postCount;
            return res.status(200).json({
                isDefaultUserId : id == String(req.user_id!),
                postsCount,
                ...users[0]
            })
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error, data: null, success: false })
        }
    }
}
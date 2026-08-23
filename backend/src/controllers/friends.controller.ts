/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import { Request, Response } from "express";
import friendshipService from "../services/friendship.service";
import db from "../config/db";
import { friendshipRequestTable as table, usersTable } from "../drizzle/schema";
import { and, eq, inArray, or, sql } from "drizzle-orm";

export default class friendsController {
    static async sendFriendshipRequest(req: Request, res: Response): Promise<Response> {
        try {

            let { data, error } = friendshipService.validateFriendshipRequestData({ from: Number(req.user_id), to: req.body.to })
            if (!data || error) {
                return res.status(401).json({ error: { message: 'Please give bearer access token' }, success: false, data: null });
            }
            if (isNaN(data.from) || isNaN(data.to)) {
                return res.status(401).json({ error: { message: 'Please give bearer access token' }, success: false, data: null });
            }
            if (data.from === data.to) {
                return res.status(400).json({ error: { message: "You can't send a friend request to yourself" }, success: false, data: null });
            }
            let isFriends = await db.select().from(table)
                .where(
                    or(
                        and(
                            eq(table.from, data.from),
                            eq(table.to, data.to),
                            eq(table.status, 'confirmed')
                        ),
                        and(
                            eq(table.from, data.to),
                            eq(table.to, data.from),
                            eq(table.status, 'confirmed')
                        ),
                    )
                );

            if (isFriends.length === 1) {
                return res.status(200).json({ data: { message: 'You both are friends' , error : null , success : true } })
            }
            let pendingRequest = await db.select().from(table)
                .where(
                    and(
                        eq(table.from, data.to),
                        eq(table.to, data.from),
                        or(
                            eq(table.status, 'pending'),
                            eq(table.status, 'declined'),
                        )
                    )
                );
            if (pendingRequest.length === 1) {
                await db.update(table)
                    .set({ status: 'confirmed', from: data.from, to: data.to })
                    .where(
                        and(
                            eq(table.from, data.to),
                            eq(table.to, data.from),
                            or(
                                eq(table.status, 'pending'),
                                eq(table.status, 'declined')
                            )
                        )
                    );

                await db.update(usersTable)
                    .set({ friends: sql`JSON_ARRAY_APPEND(${usersTable.friends}, $ ,${data.to}` })
                    .where(eq(usersTable.id, data.from));

                await db.update(usersTable)
                    .set({ friends: sql`JSON_ARRAY_APPEND(${usersTable.friends}, $ ,${data.from}` })
                    .where(eq(usersTable.id, data.to));

                return res.status(200).json({
                    success: true,
                    data: {
                        message: 'friendship request accapted'
                    },
                    error: null
                })
            }
            let isRequestedBefore = await db.select().from(table)
                .where(
                    and(
                        eq(table.from , data.from),
                        eq(table.to , data.to),
                        or(
                            eq(table.status , 'declined'),
                            eq(table.status , "pending"),
                        )
                    )
                );
            if (isRequestedBefore.length === 1) {
                return res.status(400).json({ data: { message: 'You have requested before' }, error: null, success: true })
            }
            await db.insert(table).values({
                from: data.from,
                to: data.to,
                status: 'pending',
            })
            
            return res.status(200).json({ data: { message: 'Friendship request send' }, error: null, success: true })
        } catch (error) {
            console.error(error);
            console.log(error);
            return res.status(500).json({ error, success: false, data: null })
        }
    }

    static async respondOnFriendshipRequest(req: Request, res: Response): Promise<Response> {
        try {
            let { success, error, data } = friendshipService.validateFriendshipRequestData({ to: req.user_id, from: req.body.from });
            if (error || !data || !success) {
                return res.status(400).json({ error, data: null, success: false });
            }
            let respond = req.body.respond;
            if (respond !== 'confirmed' && respond !== 'declined' ) {
                return res.status(400).json({ error : { message : 'Please give a respond '}, data: null, success: false });
            }
            await db.update(table)
                .set({
                    status: respond
                })
                .where(
                    and(
                        eq(table.from, data.from),
                        eq(table.to, data.to),
                    )
                )
                .limit(1);
            
            if (respond === 'confirmed') {
                await db.update(usersTable)
                    .set({
                        friends: sql`JSON_ARRAY_APPEND(${usersTable.friends}, $ , ${data.to} )`
                    })
                    .where(
                        eq(usersTable.id, data.from)
                    )
                    .limit(1);
                await db.update(usersTable)
                    .set({
                        friends: sql`JSON_ARRAY_APPEND(${usersTable.friends}, $ , ${data.from} )`
                    })
                    .where(
                        eq(usersTable.id, data.to)
                    )
                    .limit(1);
            }
            if (respond === 'declined') {
                await db.update(usersTable)
                    .set({
                        following: sql`JSON_ARRAY_APPEND(${usersTable.following}, $ ,${data.to}) `
                    })
                    .where(
                        eq(usersTable.id, data.from)
                    )
                    .limit(1);
                await db.update(usersTable)
                    .set({
                        followers: sql`JSON_ARRAY_APPEND(${usersTable.followers}, $ ,${data.from}) `
                    })
                    .where(
                        eq(usersTable.id, data.to)
                    )
                    .limit(1);
            }
            return res.status(200).json({ success: true, data: { message: 'respond is send' }, error: null })
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error, success: false, data: null })
        }
    }
    
    static async deletePendingFriendshipRequest(req: Request, res: Response): Promise<Response> {
        try {
            let { success, error, data } = friendshipService.validateFriendshipRequestData({ from: req.user_id, to: req.body.to });
            if (error || !data || !success) {
                return res.status(400).json({ error, data: null, success: false });
            }
            let friendRequest = await db.delete(table)
                .where(
                    and(
                        eq(table.from , data.from),
                        eq(table.to, data.to),
                        eq(table.status, 'pending')  
                    )
                )
                .limit(1)
            return res.status(200).json({})
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error, success: false, data: null })
        }
    }

    static async getFriendshipList(req: Request, res: Response): Promise<Response> {
        try{
            let userData = await db
                .select({
                    following: usersTable.following,
                    friends: usersTable.friends,
                    followers: usersTable.followers
                })
                .from(usersTable)
                .where(
                    eq(usersTable.id, req.user_id!)
                )
                .limit(1);
            
            if (userData.length !== 1 || !userData[0]) {
                return res.status(401).json({ error: { message: 'Please signup or login' } });
            }
            let followingIds = userData[0].following || [];
            let friendsIds = userData[0].friends || [];
            let followersIds = userData[0].followers || [];

            let followers: any[] = [], following: any[] = [], friends: any[] = [];

            if (friendsIds.length !== 0) {
                friends = await db
                    .select({ name: usersTable.name, avater: usersTable.avatar, id: usersTable.id })
                    .from(usersTable)
                    .where(
                        inArray(usersTable.id, friendsIds)
                    );
            }

            if (followersIds.length !== 0) {
                followers = await db
                    .select({ name: usersTable.name, avater: usersTable.avatar, id: usersTable.id })
                    .from(usersTable)
                    .where(
                        inArray(usersTable.id, followersIds)
                    );
            }

            if (followingIds.length !== 0) {
                following = await db
                    .select({ name: usersTable.name, avater: usersTable.avatar, id: usersTable.id })
                    .from(usersTable)
                    .where(
                        inArray(usersTable.id, followingIds)
                    );
            }

            return res.status(200).json({ error: null, success: false, data: { friends, following, followers } })
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error, success: false, data: null })
        }
    }
}
/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import { Request, Response } from "express";
import friendshipService from "../services/friendship.service";
import db from "../config/db";
import { friendshipRequestTable , usersTable } from "../drizzle/schema";
import { and, count, eq, inArray, notInArray, or, sql } from "drizzle-orm";
import z from "zod";

export default class friendsController {
    static async friendSugesstion(req: Request, res: Response) {
        try {
            let page = z.number().int().nonnegative().parse(Number(req.query.page || 0));
            let giveTotalPage= z.enum(['yes', 'no']).default('no').parse(req.query.giveTotalPage);
            let userAccount = (await db
                .select({ 
                    interest: usersTable.interest ,
                    friends : usersTable.friends,
                    followers : usersTable.followers,
                    following : usersTable.following,
                })
                .from(usersTable)
                .where(eq(usersTable.id, req.user_id!)).limit(1))[0];

            let pendingFriendRequest = (await db
                .select({ to : friendshipRequestTable.to})
                .from(friendshipRequestTable)
                .where(
                    and(
                        eq(friendshipRequestTable.from, req.user_id!),
                        eq(friendshipRequestTable.status, 'pending'),
                    )
                ))
                .map(({to}) => to);

            let excludeUserIds:number[] = [];
            for (let i = 0; i < userAccount.friends!.length; i++) excludeUserIds.push(userAccount.friends![i]);
            for (let i = 0; i < userAccount.followers!.length; i++) !excludeUserIds.includes(userAccount.followers![i]) && excludeUserIds.push(userAccount.followers![i]);
            for (let i = 0; i < userAccount.following!.length; i++) !excludeUserIds.includes(userAccount.following![i]) && excludeUserIds.push(userAccount.following![i]);
            for (let i = 0; i < pendingFriendRequest!.length; i++) !excludeUserIds.includes(pendingFriendRequest![i]) && excludeUserIds.push(pendingFriendRequest![i]);
            
            let suggestedUserCount: undefined | number;
            if (giveTotalPage === 'yes') {
                suggestedUserCount = (await db
                    .select({
                        count: count()
                    })
                    .from(usersTable)
                    .where(
                        and(
                            notInArray(usersTable.id, excludeUserIds),
                            sql`JSON_OVERLAPS(${usersTable.interest}, ${JSON.stringify(userAccount.interest)})`
                        )
                    ))[0].count;
            }

            let suggestedUser = await db
                .select({
                    name: usersTable.name,
                    avatar: usersTable.avatar,
                    id: usersTable.id
                })
                .from(usersTable)
                .where(
                    and(
                        notInArray(usersTable.id , excludeUserIds),
                        sql`JSON_OVERLAPS(${usersTable.interest}, ${JSON.stringify(userAccount.interest)})`
                    )
                )
                .offset(page * 25)
                .limit(25);
            let totalPages = undefined;
            if (suggestedUserCount) {
                totalPages = suggestedUserCount <= 25 ? 1 : Math.round(suggestedUserCount / 25)
            }
            return res.status(200).json({
                success: true,
                data: { 
                    suggestedUser,
                    totalPages
                },
                error : null 
            })
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error, success: false, data: null })
        }
    }

    
    static async sendFriendshipRequest(req: Request, res: Response): Promise<Response> {
        try {

            let { data, error } = friendshipService.validateFriendshipRequestData({ from: Number(req.user_id), to: req.body.to })
            if (!data || error) {
                return res.status(401).json({ error: { message: 'Please give bearer access token' }, success: false, data: null });
            }
            if (data.from === data.to) {
                return res.status(400).json({ error: { message: "You can't send a friend request to yourself" }, success: false, data: null });
            }
            let isFriends = await db.select().from(friendshipRequestTable)
                .where(
                    or(
                        and(
                            eq(friendshipRequestTable.from, data.from),
                            eq(friendshipRequestTable.to, data.to),
                            eq(friendshipRequestTable.status, 'confirmed')
                        ),
                        and(
                            eq(friendshipRequestTable.from, data.to),
                            eq(friendshipRequestTable.to, data.from),
                            eq(friendshipRequestTable.status, 'confirmed')
                        ),
                    )
                );

            if (isFriends.length === 1) {
                return res.status(200).json({ data: { message: 'You both are friends' , error : null , success : true } })
            }
            let pendingRequest = await db.select().from(friendshipRequestTable)
                .where(
                    and(
                        eq(friendshipRequestTable.from, data.to),
                        eq(friendshipRequestTable.to, data.from),
                        or(
                            eq(friendshipRequestTable.status, 'pending'),
                            eq(friendshipRequestTable.status, 'declined'),
                        )
                    )
                );
            if (pendingRequest.length === 1) {
                await db.update(friendshipRequestTable)
                    .set({ status: 'confirmed', from: data.from, to: data.to })
                    .where(
                        and(
                            eq(friendshipRequestTable.from, data.to),
                            eq(friendshipRequestTable.to, data.from),
                            or(
                                eq(friendshipRequestTable.status, 'pending'),
                                eq(friendshipRequestTable.status, 'declined')
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
            let isRequestedBefore = await db.select().from(friendshipRequestTable)
                .where(
                    and(
                        eq(friendshipRequestTable.from , data.from),
                        eq(friendshipRequestTable.to , data.to),
                        or(
                            eq(friendshipRequestTable.status , 'declined'),
                            eq(friendshipRequestTable.status , "pending"),
                        )
                    )
                );
            if (isRequestedBefore.length === 1) {
                return res.status(400).json({ data: { message: 'You have requested before' }, error: null, success: true })
            }
            await db.insert(friendshipRequestTable).values({
                from: data.from,
                to: data.to,
                status: 'pending',
            })
            
            return res.status(200).json({ data: { message: 'Friendship request send' }, error: null, success: true })
        } catch (error) {
            console.error(error);
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
            await db.update(friendshipRequestTable)
                .set({
                    status: respond
                })
                .where(
                    and(
                        eq(friendshipRequestTable.from, data.from),
                        eq(friendshipRequestTable.to, data.to),
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
            let friendRequest = await db.delete(friendshipRequestTable)
                .where(
                    and(
                        eq(friendshipRequestTable.from , data.from),
                        eq(friendshipRequestTable.to, data.to),
                        eq(friendshipRequestTable.status, 'pending')  
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
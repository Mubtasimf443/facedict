/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import { Request, Response } from "express";
import friendshipService from "../services/friendship.service";
import db from "../config/db";
import { friendshipRequestTable as fTable , usersTable } from "../drizzle/schema";
import { and, count, desc, eq, inArray, notInArray, or, sql } from "drizzle-orm";
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
                .select({ to : fTable.to})
                .from(fTable)
                .where(
                    and(
                        eq(fTable.from, req.user_id!),
                        eq(fTable.status, 'pending'),
                    )
                ))
                .map(({to}) => to);

            let excludeUserIds:number[] = [];
            for (let i = 0; i < userAccount.friends!.length; i++) excludeUserIds.push(userAccount.friends![i]);
            for (let i = 0; i < userAccount.followers!.length; i++) !excludeUserIds.includes(userAccount.followers![i]) && excludeUserIds.push(userAccount.followers![i]);
            for (let i = 0; i < userAccount.following!.length; i++) !excludeUserIds.includes(userAccount.following![i]) && excludeUserIds.push(userAccount.following![i]);
            for (let i = 0; i < pendingFriendRequest!.length; i++) !excludeUserIds.includes(pendingFriendRequest![i]) && excludeUserIds.push(pendingFriendRequest![i]);
            excludeUserIds.push(req.user_id!);
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
                .orderBy(desc(usersTable.createdAt))
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
    
    static async friendRequest(req: Request, res: Response) {
        try {
            let requests = await db
                .select({
                    request_id : fTable.id,
                    userId : usersTable.id,
                    userName: usersTable.name,
                    userImage: usersTable.avatar,
                })
                .from(fTable)
                .where(
                    and(
                        eq(fTable.to, req.user_id!),
                        eq(fTable.status, 'pending')
                    )
                )
                .orderBy(desc(fTable.createdAt))
                .leftJoin(usersTable, eq(fTable.from, usersTable.id));
            return res.status(200).json({ data: { requests }, success: true, error: null })
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error, data: null, success: false })
        }
    }

    static async sendFriendshipRequest(req: Request, res: Response): Promise<Response> {
        try {

            let { data, error } = friendshipService.validateFriendshipRequestData({ from: req.user_id!, to: req.body.to })
            if (!data || error) {
                return res.status(401).json({ error: { message: 'Please give bearer access token' }, success: false, data: null });
            }
            if (data.from === data.to) {
                return res.status(400).json({ error: { message: "You can't send a friend request to yourself" }, success: false, data: null });
            }
            let isFriends = await db.select().from(fTable)
                .where(
                    or(
                        and(
                            eq(fTable.from, data.from),
                            eq(fTable.to, data.to),
                            eq(fTable.status, 'confirmed')
                        ),
                        and(
                            eq(fTable.from, data.to),
                            eq(fTable.to, data.from),
                            eq(fTable.status, 'confirmed')
                        ),
                    )
                );

            if (isFriends.length === 1) {
                return res.status(200).json({ data: { message: 'You both are friends', friendshipStatus : 'Friends' }, error: null, success: true })
            }
            let pendingRequest = await db.select().from(fTable)
                .where(
                    and(
                        eq(fTable.from, data.to),
                        eq(fTable.to, data.from),
                        or(
                            eq(fTable.status, 'pending'),
                            eq(fTable.status, 'declined'),
                        )
                    )
                );
            if (pendingRequest.length === 1) {
                await db.update(fTable)
                    .set({ status: 'confirmed', from: data.from, to: data.to })
                    .where(
                        and(
                            eq(fTable.from, data.to),
                            eq(fTable.to, data.from),
                            or(
                                eq(fTable.status, 'pending'),
                                eq(fTable.status, 'declined')
                            )
                        )
                    );

                await db.update(usersTable)
                    .set({ friends: sql`JSON_ARRAY_APPEND(${usersTable.friends},'$',${data.to}` })
                    .where(eq(usersTable.id, data.from));

                await db.update(usersTable)
                    .set({ friends: sql`JSON_ARRAY_APPEND(${usersTable.friends}, '$',${data.from}` })
                    .where(eq(usersTable.id, data.to));

                return res.status(200).json({
                    success: true,
                    data: {
                        message: 'friendship request accapted',
                        friendshipStatus : 'Friends'
                    },
                    error: null
                })
            }
            let isRequestedBefore = await db.select().from(fTable)
                .where(
                    and(
                        eq(fTable.from , data.from),
                        eq(fTable.to , data.to),
                        or(
                            eq(fTable.status , 'declined'),
                            eq(fTable.status , "pending"),
                        )
                    )
                );
            if (isRequestedBefore.length === 1) {
                return res.status(200).json({ data: { message: 'You have requested before', friendshipStatus: 'Requested' }, error: null, success: true })
            }
            await db.insert(fTable).values({
                from: data.from,
                to: data.to,
                status: 'pending',
            })
            
            return res.status(200).json({ data: { message: 'Friendship request send', friendshipStatus : 'Requested'   }, error: null, success: true })
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
            await db.update(fTable)
                .set({
                    status: respond
                })
                .where(
                    and(
                        eq(fTable.from, data.from),
                        eq(fTable.to, data.to),
                    )
                )
                .limit(1);
            
            if (respond === 'confirmed') {
                await db.update(usersTable)
                    .set({
                        friends: sql`JSON_ARRAY_APPEND(${usersTable.friends}, '$', ${data.to} )`
                    })
                    .where(
                        eq(usersTable.id, data.from)
                    )
                    .limit(1);
                await db.update(usersTable)
                    .set({
                        friends: sql`JSON_ARRAY_APPEND(${usersTable.friends}, '$', ${data.from} )`
                    })
                    .where(
                        eq(usersTable.id, data.to)
                    )
                    .limit(1);
            }
            if (respond === 'declined') {
                await db.update(usersTable)
                    .set({
                        following: sql`JSON_ARRAY_APPEND(${usersTable.following}, '$',${data.to}) `
                    })
                    .where(
                        eq(usersTable.id, data.from)
                    )
                    .limit(1);
                await db.update(usersTable)
                    .set({
                        followers: sql`JSON_ARRAY_APPEND(${usersTable.followers}, '$',${data.from}) `
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
            let friendRequest = await db.delete(fTable)
                .where(
                    and(
                        eq(fTable.from , data.from),
                        eq(fTable.to, data.to),
                        eq(fTable.status, 'pending')  
                    )
                )
                .limit(1)
            return res.status(200).json({ success: true, data: null, error: null })
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

    static async unfriendUser(req: Request, res: Response){
        try {
            let rasult = friendshipService.validateFriendshipRequestData({ from: req.user_id, to: req.body.to });
            if (rasult.error) {
                return res.status(400).json({ error : rasult.error})
            };
           
            let users = await db
                .select({ friends: usersTable.friends })
                .from(usersTable)
                .where(
                    inArray(usersTable.id, [rasult.data.from, rasult.data.to])
                );
            if (users.length != 2 ) {
                return res.status(400).json({ success : false , data : null , error : { message : 'One of the friend is deleted'}});
            }
            await db
                .update(usersTable)
                .set({ friends: users[0].friends!.filter(f => f !== rasult.data.to) })
                .where(
                    eq(usersTable.id, rasult.data.from)
                )
                .limit(1);

            await db
                .update(usersTable)
                .set({ friends: users[1].friends!.filter(f => f !== rasult.data.from) })
                .where(
                    eq(usersTable.id, rasult.data.to)
                )
                .limit(1);

            await db
                .delete(fTable)
                .where(
                    or(
                        and(
                            eq(fTable.from, rasult.data.from),
                            eq(fTable.to, rasult.data.to),
                            eq(fTable.status, 'confirmed')
                        ),
                        and(
                            eq(fTable.from, rasult.data.to),
                            eq(fTable.to, rasult.data.from),
                            eq(fTable.status, 'confirmed')
                        ),
                    )
                );
            return res.status(200).json({ success: true, error: null, data: null })
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error, success: false, data: null })
        }
    }
}
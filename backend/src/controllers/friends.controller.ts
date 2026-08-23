/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import { Request, Response } from "express";
import friendshipService from "../services/friendship.service";
import db from "../config/db";
import { friendshipRequestTable as table, usersTable } from "../drizzle/schema";
import { and, eq, or, sql } from "drizzle-orm";

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
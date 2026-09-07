"use strict";
/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const friendship_service_1 = __importDefault(require("../services/friendship.service"));
const db_1 = __importDefault(require("../config/db"));
const schema_1 = require("../drizzle/schema");
const drizzle_orm_1 = require("drizzle-orm");
class friendsController {
    static async sendFriendshipRequest(req, res) {
        try {
            let { data, error } = friendship_service_1.default.validateFriendshipRequestData({ from: Number(req.user_id), to: req.body.to });
            if (!data || error) {
                return res.status(401).json({ error: { message: 'Please give bearer access token' }, success: false, data: null });
            }
            if (isNaN(data.from) || isNaN(data.to)) {
                return res.status(401).json({ error: { message: 'Please give bearer access token' }, success: false, data: null });
            }
            if (data.from === data.to) {
                return res.status(400).json({ error: { message: "You can't send a friend request to yourself" }, success: false, data: null });
            }
            let isFriends = await db_1.default.select().from(schema_1.friendshipRequestTable)
                .where((0, drizzle_orm_1.or)((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.friendshipRequestTable.from, data.from), (0, drizzle_orm_1.eq)(schema_1.friendshipRequestTable.to, data.to), (0, drizzle_orm_1.eq)(schema_1.friendshipRequestTable.status, 'confirmed')), (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.friendshipRequestTable.from, data.to), (0, drizzle_orm_1.eq)(schema_1.friendshipRequestTable.to, data.from), (0, drizzle_orm_1.eq)(schema_1.friendshipRequestTable.status, 'confirmed'))));
            if (isFriends.length === 1) {
                return res.status(200).json({ data: { message: 'You both are friends', error: null, success: true } });
            }
            let pendingRequest = await db_1.default.select().from(schema_1.friendshipRequestTable)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.friendshipRequestTable.from, data.to), (0, drizzle_orm_1.eq)(schema_1.friendshipRequestTable.to, data.from), (0, drizzle_orm_1.or)((0, drizzle_orm_1.eq)(schema_1.friendshipRequestTable.status, 'pending'), (0, drizzle_orm_1.eq)(schema_1.friendshipRequestTable.status, 'declined'))));
            if (pendingRequest.length === 1) {
                await db_1.default.update(schema_1.friendshipRequestTable)
                    .set({ status: 'confirmed', from: data.from, to: data.to })
                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.friendshipRequestTable.from, data.to), (0, drizzle_orm_1.eq)(schema_1.friendshipRequestTable.to, data.from), (0, drizzle_orm_1.or)((0, drizzle_orm_1.eq)(schema_1.friendshipRequestTable.status, 'pending'), (0, drizzle_orm_1.eq)(schema_1.friendshipRequestTable.status, 'declined'))));
                await db_1.default.update(schema_1.usersTable)
                    .set({ friends: (0, drizzle_orm_1.sql) `JSON_ARRAY_APPEND(${schema_1.usersTable.friends}, $ ,${data.to}` })
                    .where((0, drizzle_orm_1.eq)(schema_1.usersTable.id, data.from));
                await db_1.default.update(schema_1.usersTable)
                    .set({ friends: (0, drizzle_orm_1.sql) `JSON_ARRAY_APPEND(${schema_1.usersTable.friends}, $ ,${data.from}` })
                    .where((0, drizzle_orm_1.eq)(schema_1.usersTable.id, data.to));
                return res.status(200).json({
                    success: true,
                    data: {
                        message: 'friendship request accapted'
                    },
                    error: null
                });
            }
            let isRequestedBefore = await db_1.default.select().from(schema_1.friendshipRequestTable)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.friendshipRequestTable.from, data.from), (0, drizzle_orm_1.eq)(schema_1.friendshipRequestTable.to, data.to), (0, drizzle_orm_1.or)((0, drizzle_orm_1.eq)(schema_1.friendshipRequestTable.status, 'declined'), (0, drizzle_orm_1.eq)(schema_1.friendshipRequestTable.status, "pending"))));
            if (isRequestedBefore.length === 1) {
                return res.status(400).json({ data: { message: 'You have requested before' }, error: null, success: true });
            }
            await db_1.default.insert(schema_1.friendshipRequestTable).values({
                from: data.from,
                to: data.to,
                status: 'pending',
            });
            return res.status(200).json({ data: { message: 'Friendship request send' }, error: null, success: true });
        }
        catch (error) {
            console.error(error);
            console.log(error);
            return res.status(500).json({ error, success: false, data: null });
        }
    }
    static async respondOnFriendshipRequest(req, res) {
        try {
            let { success, error, data } = friendship_service_1.default.validateFriendshipRequestData({ to: req.user_id, from: req.body.from });
            if (error || !data || !success) {
                return res.status(400).json({ error, data: null, success: false });
            }
            let respond = req.body.respond;
            if (respond !== 'confirmed' && respond !== 'declined') {
                return res.status(400).json({ error: { message: 'Please give a respond ' }, data: null, success: false });
            }
            await db_1.default.update(schema_1.friendshipRequestTable)
                .set({
                status: respond
            })
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.friendshipRequestTable.from, data.from), (0, drizzle_orm_1.eq)(schema_1.friendshipRequestTable.to, data.to)))
                .limit(1);
            if (respond === 'confirmed') {
                await db_1.default.update(schema_1.usersTable)
                    .set({
                    friends: (0, drizzle_orm_1.sql) `JSON_ARRAY_APPEND(${schema_1.usersTable.friends}, $ , ${data.to} )`
                })
                    .where((0, drizzle_orm_1.eq)(schema_1.usersTable.id, data.from))
                    .limit(1);
                await db_1.default.update(schema_1.usersTable)
                    .set({
                    friends: (0, drizzle_orm_1.sql) `JSON_ARRAY_APPEND(${schema_1.usersTable.friends}, $ , ${data.from} )`
                })
                    .where((0, drizzle_orm_1.eq)(schema_1.usersTable.id, data.to))
                    .limit(1);
            }
            if (respond === 'declined') {
                await db_1.default.update(schema_1.usersTable)
                    .set({
                    following: (0, drizzle_orm_1.sql) `JSON_ARRAY_APPEND(${schema_1.usersTable.following}, $ ,${data.to}) `
                })
                    .where((0, drizzle_orm_1.eq)(schema_1.usersTable.id, data.from))
                    .limit(1);
                await db_1.default.update(schema_1.usersTable)
                    .set({
                    followers: (0, drizzle_orm_1.sql) `JSON_ARRAY_APPEND(${schema_1.usersTable.followers}, $ ,${data.from}) `
                })
                    .where((0, drizzle_orm_1.eq)(schema_1.usersTable.id, data.to))
                    .limit(1);
            }
            return res.status(200).json({ success: true, data: { message: 'respond is send' }, error: null });
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ error, success: false, data: null });
        }
    }
    static async deletePendingFriendshipRequest(req, res) {
        try {
            let { success, error, data } = friendship_service_1.default.validateFriendshipRequestData({ from: req.user_id, to: req.body.to });
            if (error || !data || !success) {
                return res.status(400).json({ error, data: null, success: false });
            }
            let friendRequest = await db_1.default.delete(schema_1.friendshipRequestTable)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.friendshipRequestTable.from, data.from), (0, drizzle_orm_1.eq)(schema_1.friendshipRequestTable.to, data.to), (0, drizzle_orm_1.eq)(schema_1.friendshipRequestTable.status, 'pending')))
                .limit(1);
            return res.status(200).json({});
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ error, success: false, data: null });
        }
    }
    static async getFriendshipList(req, res) {
        try {
            let userData = await db_1.default
                .select({
                following: schema_1.usersTable.following,
                friends: schema_1.usersTable.friends,
                followers: schema_1.usersTable.followers
            })
                .from(schema_1.usersTable)
                .where((0, drizzle_orm_1.eq)(schema_1.usersTable.id, req.user_id))
                .limit(1);
            if (userData.length !== 1 || !userData[0]) {
                return res.status(401).json({ error: { message: 'Please signup or login' } });
            }
            let followingIds = userData[0].following || [];
            let friendsIds = userData[0].friends || [];
            let followersIds = userData[0].followers || [];
            let followers = [], following = [], friends = [];
            if (friendsIds.length !== 0) {
                friends = await db_1.default
                    .select({ name: schema_1.usersTable.name, avater: schema_1.usersTable.avatar, id: schema_1.usersTable.id })
                    .from(schema_1.usersTable)
                    .where((0, drizzle_orm_1.inArray)(schema_1.usersTable.id, friendsIds));
            }
            if (followersIds.length !== 0) {
                followers = await db_1.default
                    .select({ name: schema_1.usersTable.name, avater: schema_1.usersTable.avatar, id: schema_1.usersTable.id })
                    .from(schema_1.usersTable)
                    .where((0, drizzle_orm_1.inArray)(schema_1.usersTable.id, followersIds));
            }
            if (followingIds.length !== 0) {
                following = await db_1.default
                    .select({ name: schema_1.usersTable.name, avater: schema_1.usersTable.avatar, id: schema_1.usersTable.id })
                    .from(schema_1.usersTable)
                    .where((0, drizzle_orm_1.inArray)(schema_1.usersTable.id, followingIds));
            }
            return res.status(200).json({ error: null, success: false, data: { friends, following, followers } });
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ error, success: false, data: null });
        }
    }
}
exports.default = friendsController;

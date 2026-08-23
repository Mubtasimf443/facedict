/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import z from "zod";

export default class friendshipService {
    static validateFriendshipRequestData(data : object) {
        let schema =z.object({
            from : z.number(),
            to : z.number(),
        });
        return schema.safeParse(data);
    }
}
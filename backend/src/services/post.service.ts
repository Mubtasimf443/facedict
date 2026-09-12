/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import z from "zod";
import { interest } from "../types/auth.types";

export default class PostService {
    static validateCreatePostData(data: any) {
        let schema = z.object({
            caption : z.string().max(1200).min(4),
            images: z.array(z.url()).nonempty().max(5),
            tags : z.array(z.string().max(150)).min(1).max(10),
            interest :z.array(z.enum(interest)).nonempty().max(5)
        });
        return schema.safeParse(data)
    }
}
/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import z from "zod";
import { interest } from "../types/auth.types";

export default class PostService {
    static validateCreatePostData(data: any) {
        let schema = z.object({
            caption : z.string().max(1200).min(4),
            images: z.array(z.url()).nonempty(),
            tags : z.array(z.string().max(255)).min(1).max(15),
            interest :z.array(z.enum(interest)).nonempty()
        });
        return schema.safeParse(data)
    }
}
"use strict";
/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const post_service_1 = __importDefault(require("../services/post.service"));
class postController {
    static async getFeed(req, res) {
        try {
            return res.status(200).json({});
        }
        catch (error) {
            console.error(error);
            return res.status(200).json({ error, success: false, data: null });
        }
    }
    static async createPost(req, res) {
        try {
            let userId = req.user_id;
            let { success, data, error } = post_service_1.default.validateCreatePostData(req.body);
            if (!success || !data || !!error) {
                return res.status(400).json({});
            }
            // let ids = await db.insert(postTables)
            //     .values({
            //         caption: data.caption,
            //         images: data.images,
            //         tags: data.tags,
            //         interest: data.interest
            //     }).$returningId();
            return res.status(200).json({
                error: null,
                success: true,
                // data: { id: ids[0].id } 
            });
        }
        catch (error) {
            console.error(error);
            return res.status(200).json({ error, success: false, data: null });
        }
    }
}
exports.default = postController;

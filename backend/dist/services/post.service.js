"use strict";
/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = __importDefault(require("zod"));
const auth_types_1 = require("../types/auth.types");
class PostService {
    static validateCreatePostData(data) {
        let schema = zod_1.default.object({
            caption: zod_1.default.string().max(1200).min(4),
            images: zod_1.default.array(zod_1.default.url()).nonempty(),
            tags: zod_1.default.array(zod_1.default.string().max(255)).min(1).max(15),
            interest: zod_1.default.array(zod_1.default.enum(auth_types_1.interest)).nonempty()
        });
        return schema.safeParse(data);
    }
}
exports.default = PostService;

"use strict";
/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = __importDefault(require("zod"));
class friendshipService {
    static validateFriendshipRequestData(data) {
        let schema = zod_1.default.object({
            from: zod_1.default.number(),
            to: zod_1.default.number(),
        });
        return schema.safeParse(data);
    }
}
exports.default = friendshipService;

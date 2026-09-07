"use strict";
/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = __importDefault(require("zod"));
const auth_types_1 = require("../types/auth.types");
const crypto_1 = __importDefault(require("crypto"));
class AuthService {
    static comparePassword(password, hashPassword, salt) {
        return crypto_1.default.scryptSync(password, salt, 64).toString('hex').normalize() === hashPassword;
    }
    static hashPassword(password) {
        let salt = crypto_1.default.randomBytes(16).toString('hex');
        let hashed_password = crypto_1.default.scryptSync(password, salt, 64).toString('hex').normalize();
        return { hashed_password, salt };
    }
    static validateSignUpData(user) {
        const EducationEntrySchema = zod_1.default.object({
            institution: zod_1.default.string(),
            degree: zod_1.default.string().optional(),
            startYear: zod_1.default.number().int().optional(),
            endYear: zod_1.default.number().int().optional(),
        });
        const LocationSchema = zod_1.default.object({
            city: zod_1.default.string().optional(),
            country: zod_1.default.enum(auth_types_1.countries).optional(),
            latitude: zod_1.default.number().optional(),
            longitude: zod_1.default.number().optional(),
        });
        const JobSchema = zod_1.default.object({
            title: zod_1.default.string().optional(),
            industry_type: zod_1.default.enum(auth_types_1.industryTypes),
            company: zod_1.default.string().optional(),
            startDate: zod_1.default.string().optional(), // ISO date string
            endDate: zod_1.default.string().optional(), // ISO date string
        });
        const UserSchema = zod_1.default.object({
            name: zod_1.default.string().max(50).min(4),
            email: zod_1.default.string().email(),
            religion: zod_1.default.enum(auth_types_1.religions),
            nationality: zod_1.default.enum(auth_types_1.nationalities),
            languages: zod_1.default.array(zod_1.default.enum(auth_types_1.languages)),
            age: zod_1.default.number().gte(16).lte(120).int().nonnegative(),
            gender: zod_1.default.enum(["male", "female", "other"]).optional(),
            interest: zod_1.default.array(zod_1.default.enum(auth_types_1.interest)).nonempty(),
            hashed_password: zod_1.default.string(),
            salt: zod_1.default.string(),
            is_active: zod_1.default.boolean().default(true),
            is_verified: zod_1.default.boolean().default(false),
        });
        return UserSchema.safeParse(user);
    }
    static generate_auth_session() {
        return crypto_1.default.randomBytes(80).toString('hex').normalize();
    }
    static validateLoginInfo(data) {
        let schema = zod_1.default.object({
            email: zod_1.default.string().email().max(255).min(5),
            password: zod_1.default.string().max(30)
        });
        return schema.parse(data);
    }
}
exports.default = AuthService;

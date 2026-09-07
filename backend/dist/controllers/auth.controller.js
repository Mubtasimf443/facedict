"use strict";
/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_service_1 = __importDefault(require("../services/auth.service"));
const radis_1 = require("../config/radis");
const GenerateOtp_1 = __importDefault(require("../utils/core/GenerateOtp"));
const zod_1 = __importStar(require("zod"));
const auth_mails_1 = __importDefault(require("../utils/mails/auth.mails"));
const console_1 = require("console");
const db_1 = __importDefault(require("../config/db"));
const schema_1 = require("../drizzle/schema");
const drizzle_orm_1 = require("drizzle-orm");
const env_1 = require("../config/env");
class AuthController {
    static async SignUp(req, res) {
        try {
            let password = req.body.password?.trim();
            if (!password || password?.length < 8 || password?.length > 32)
                return res.status(400).json({ success: false, data: null, error: { message: 'Invalid password ' } });
            let { salt, hashed_password } = auth_service_1.default.hashPassword(password);
            let { error, data, success } = auth_service_1.default.validateSignUpData({ ...req.body, hashed_password, salt });
            if (error || !data || !success) {
                return res.status(400).json({ success: false, data: null, error });
            }
            let existingUser = await db_1.default.select().from(schema_1.usersTable).where((0, drizzle_orm_1.eq)(schema_1.usersTable.email, data.email)).limit(1);
            if (existingUser.length > 0) {
                return res.status(400).json({ success: false, data: null, error: { message: 'This email is registered, please sign in with the email' } });
            }
            let suvs = auth_service_1.default.generate_auth_session();
            let otp = (0, GenerateOtp_1.default)();
            let payload = JSON.stringify({ ...data, otp });
            let isOk = await radis_1.redisClient.set(`sign_up_verification_session:${suvs}`, payload, 'EX', 65);
            if (isOk != 'OK') {
                throw 'Redis session setup failed';
            }
            let isOtpSend = await (0, auth_mails_1.default)(data.email, otp);
            if (!isOtpSend)
                throw " failed send otp by mail";
            return res
                .status(200)
                .cookie('sign_up_verification_session', suvs, {
                httpOnly: true,
                sameSite: env_1.COOKIES_SAMESITE,
                maxAge: 65 * 1000,
                secure: env_1.NODE_ENV === 'production'
            })
                .json({ success: true, data: { session: suvs }, error: null });
        }
        catch (error) {
            console.error({ error });
            return res.status(500).json({ success: false, data: null, error });
        }
    }
    static async SignUpOtpVerification(req, res) {
        try {
            const authSessionSchema = zod_1.default
                .string()
                .length(160, { message: 'Auth session token must be exactly 160 characters long' })
                .regex(/^[0-9a-f]{160}$/, { message: 'Auth session token must be a valid hex string' });
            let userData = await radis_1.redisClient.get(`sign_up_verification_session:${authSessionSchema.parse(req.cookies.sign_up_verification_session)}`);
            if (!userData) {
                return res.status(400).json({ data: null, error: { message: 'Signup sesssion has expired' }, success: false });
            }
            userData = JSON.parse(userData);
            if (userData.otp !== req.body.otp)
                return res.status(400).json({ success: false, error: { message: "incorect otp" }, data: null });
            let user = await db_1.default
                .insert(schema_1.usersTable)
                .values({ ...userData, is_verified: true, is_active: true })
                .$returningId();
            (0, console_1.log)({ user });
            let login_session = auth_service_1.default.generate_auth_session();
            radis_1.redisClient.set(`login_session:${login_session}`, JSON.stringify({ id: user[0].id }), 'EX', 7 * 24 * 60 * 60);
            return res
                .status(200)
                .cookie('login_session', login_session, {
                httpOnly: true,
                sameSite: env_1.COOKIES_SAMESITE,
                maxAge: 7 * 24 * 60 * 60 * 1000,
                secure: env_1.NODE_ENV === 'production'
            })
                .json({ success: true, error: null });
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, data: null, error });
        }
    }
    static async Login(req, res) {
        try {
            let data = auth_service_1.default.validateLoginInfo(req.body);
            let user = await db_1.default.select().from(schema_1.usersTable).where((0, drizzle_orm_1.eq)(schema_1.usersTable.email, data.email));
            if (user.length !== 1) {
                return res.status(400).json({ error: { message: "Please create a account" }, data: null, success: false });
            }
            let isPassworMatch = auth_service_1.default.comparePassword(data.password, user[0].hashed_password, user[0].salt);
            if (!isPassworMatch) {
                return res.status(400).json({
                    success: false,
                    data: null,
                    error: {
                        message: 'Passsword is invalid'
                    }
                });
            }
            let login_session = auth_service_1.default.generate_auth_session();
            radis_1.redisClient.set(`login_session:${login_session}`, JSON.stringify({ id: user[0].id }), 'EX', 7 * 24 * 60 * 60);
            return res
                .status(200)
                .cookie('login_session', login_session, {
                httpOnly: true,
                sameSite: env_1.COOKIES_SAMESITE,
                maxAge: 7 * 24 * 60 * 60 * 1000,
                secure: env_1.NODE_ENV === 'production'
            })
                .json({ success: true, error: null });
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                return res.status(400).json({ error, data: null, success: false });
            }
            console.error(error);
            return res.status(500).json({ success: false, data: null, error });
        }
    }
    static async Logout(req, res) {
        try {
            const authSessionSchema = zod_1.default
                .string()
                .length(160, { message: 'Auth session token must be exactly 160 characters long' })
                .regex(/^[0-9a-f]{160}$/, { message: 'Auth session token must be a valid hex string' });
            await radis_1.redisClient.del(`login_session:${authSessionSchema.parse(req.body.session)}`);
            return res
                .status(200)
                .clearCookie('login_session', {
                httpOnly: true,
                sameSite: env_1.COOKIES_SAMESITE,
                secure: env_1.NODE_ENV === 'production'
            })
                .json({ success: true, data: null, error: null });
        }
        catch (error) {
            console.error({ error });
            return res.status(500).json({ error });
        }
    }
    static async userDetails(req, res) {
        try {
            let user = await db_1.default
                .select({
                id: schema_1.usersTable.id,
                name: schema_1.usersTable.name,
                email: schema_1.usersTable.email,
                avater: schema_1.usersTable.avatar,
                coverImage: schema_1.usersTable.coverImage,
                bio: schema_1.usersTable.bio,
            })
                .from(schema_1.usersTable)
                .where((0, drizzle_orm_1.eq)(schema_1.usersTable.id, req.user_id))
                .limit(1);
            if (user.length === 0)
                return res.status(404).json({ error: { message: 'No User found from this account' } });
            return res.status(200).json({
                success: true,
                data: { user: user[0] },
                error: null
            });
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ error });
        }
    }
}
exports.default = AuthController;

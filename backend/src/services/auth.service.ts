/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import z from "zod";
import { countries, hobbies, industryTypes, interest, languages, nationalities, religions } from "../types/auth.types";
import crypto from 'crypto'

export default class AuthService {
    static comparePassword(password: string, hashPassword: string, salt: string) {
        return crypto.scryptSync(password, salt, 64).toString('hex').normalize() === hashPassword;
    }
    static hashPassword(password:string) {
        let salt = crypto.randomBytes(16).toString('hex');
        let hashed_password = crypto.scryptSync(password,salt,64).toString('hex').normalize();

        return {hashed_password ,  salt };
    }
    static validateSignUpData(user :any) {
        const EducationEntrySchema = z.object({
            institution: z.string(),
            degree: z.string().optional(),
            startYear: z.number().int().optional(),
            endYear: z.number().int().optional(),
        });


        const LocationSchema = z.object({
            city : z.string().optional(),
        
            country : z.enum(countries).optional(),
            latitude: z.number().optional(),
            longitude: z.number().optional(),
        });

        const JobSchema = z.object({
            title: z.string().optional(),
            industry_type : z.enum(industryTypes),
            company: z.string().optional(),
            startDate: z.string().optional(), // ISO date string
            endDate: z.string().optional(),   // ISO date string
        });

        const UserSchema = z.object({
            name: z.string().max(50).min(4),
            email: z.string().email(),
            religion :z.enum(religions),
            nationality: z.enum(nationalities),

            languages: z.array( z.enum(languages) ),

            age: z.number().gte(16).lte(120).int().nonnegative(),

            gender: z.enum(["male", "female", "other"]).optional(),

        
            hobbies: z.array( z.enum(hobbies)).nonempty(),

            interest: z.array(z.enum(interest)).nonempty(),

            hashed_password: z.string(),
            salt: z.string(),

            is_active: z.boolean().default(true),
            is_verified: z.boolean().default(false),
        })

        return UserSchema.safeParse(user)
    }
    static generate_auth_session() {
        return crypto.randomBytes(80).toString('hex').normalize()
    }

    static validateLoginInfo(data : any) {
        let schema = z.object({
            email : z.string().email().max(255).min(5),
            password : z.string().max(255)
        })
        return schema.parse(data)
    }
}
/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import z from "zod";

export default class ProfileService {
    static validateProfileInfo(data: any) {
        let schema = z.object({
            name: z
                .string()
                .trim()
                .min(1, { message: "Name is required" })
                .max(50, { message: "Name must be at most 50 characters" }),

            bio: z
                .string()
                .trim()
                .max(150, { message: "Bio must be at most 150 characters" })
                .optional()
                .or(z.literal('')),

            city: z
                .string()
                .trim()
                .max(100, { message: "City must be at most 100 characters" })
                .optional()
                .or(z.literal('')),

            country: z
                .string()
                .trim()
                .max(100, { message: "Country must be at most 100 characters" })
                .optional()
                .or(z.literal('')),

            website: z
                .url({ message: "Please enter a valid URL" })
                .max(300, { message: "Website URL must be at most 300 characters" })
                .optional()
                .or(z.literal('')),

            religion: z
                .string()
                .trim()
                .max(50, { message: "Religion must be at most 50 characters" })
                .optional()
                .or(z.literal('')),

            about: z
                .string()
                .trim()
                .max(1000, { message: "About must be at most 1000 characters" })
                .optional()
                .or(z.literal('')),

            coverImage: z
                .url({ message: "Cover image must be a valid URL" })
                .optional()
                .or(z.literal('')),

            profileImage: z
                .url({ message: "Profile image must be a valid URL" })
                .optional()
                .or(z.literal(''))
        });
        return schema.safeParse(data)
    }
    static validateEducation(data:any) {
        let schema = z.object({
            institution: z.string().max(255),
            degree: z.string().max(255),
            startYear: z.number().min(new Date().getFullYear() - 90).max(new Date().getFullYear() - 1),
            endYear: z.number().min(new Date().getFullYear() - 90).max(new Date().getFullYear())
        });
        return schema.safeParse(data)
    }
}
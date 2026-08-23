/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import { timestamp } from "drizzle-orm/mysql-core";
import { date } from "drizzle-orm/mysql-core";
import { mysqlTable, boolean , json, varchar , text, int } from "drizzle-orm/mysql-core";
import { hobbies } from "../types/auth.types";
import { mysqlEnum } from "drizzle-orm/mysql-core";
import { uniqueIndex } from "drizzle-orm/mysql-core";

export const usersTable = mysqlTable("usersTable", {
    id: int('id').primaryKey().autoincrement().unique(),
    name: varchar('name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    age: int('age').notNull(),
    gender: varchar('gender', { length: 255 }).notNull(),
    nationality: varchar('nationality', { length: 50 }).notNull(),
    is_verified: boolean('is_verified').default(false),
    is_active: boolean('is_active').default(true),
    religion: varchar('religion', { length: 100 }).notNull(),
    bio: varchar('bio', { length: 120 }),
    avatar: varchar('avatar', { length: 255 }),
    hashed_password: text('hashed_password').notNull(),
    salt: text('salt').notNull(),
    languages: json('languages').$type<string[]>(),
    interest: json('interest').$type<string[]>(),
    location: json('location').$type<{
        city: string;
        country: string;
        latitude: string;
        longitude: string;
    }>(),
    education: json('education').$type<{
        institution: string;
        degree: string;
        startYear: number;
        endYear: number;
    }[]>(),
    job: json('job').$type<{
        title: string;
        industry_type: string;
        company: string;
        startDate: number,
        endDate: number,
    }[]>(),
    createdAt : timestamp('createdAt').defaultNow().notNull(),
    friends : json('friends').$type<number[]>().default([]),
    following : json('following').$type<number[]>().default([]),
    followers : json('followers').$type<number[]>().default([]),
    
});

export const postTables = mysqlTable('postTable', {
    id : int('id').primaryKey().autoincrement().unique(),
    caption : text('caption').notNull(),
    images : json('images').$type<{url : string}[]>(),
    createdAt : timestamp('createdAt').defaultNow().notNull(),
    likes : json('likes').$type<{ 
        userId : number ,
        time : Date
    }[]>(),
    tags : json('tags').$type<string[]>(),
    interest : json('interest').$type<string[]>(),
});


export const friendshipRequestTable = mysqlTable('friendshipRequest', {
    id : int('id').primaryKey().autoincrement().notNull(),
    from: int('from').notNull().references(() => usersTable.id, { onDelete: 'cascade' }),
    to: int('to').notNull().references(() => usersTable.id, { onDelete: 'cascade' }),
    status : mysqlEnum('status', ['confirmed', 'pending', 'declined']).default('pending').notNull(),
    createdAt : timestamp('createdAt').defaultNow().notNull()
},(table) => ({
    uniquePair: uniqueIndex('unique_from_to').on(table.from, table.to),
}))
"use strict";
/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */
Object.defineProperty(exports, "__esModule", { value: true });
exports.postTables = exports.friendshipRequestTable = exports.usersTable = void 0;
const mysql_core_1 = require("drizzle-orm/mysql-core");
const mysql_core_2 = require("drizzle-orm/mysql-core");
const mysql_core_3 = require("drizzle-orm/mysql-core");
const mysql_core_4 = require("drizzle-orm/mysql-core");
exports.usersTable = (0, mysql_core_2.mysqlTable)("usersTable", {
    id: (0, mysql_core_2.int)('id').primaryKey().autoincrement().unique(),
    name: (0, mysql_core_2.varchar)('name', { length: 255 }).notNull(),
    email: (0, mysql_core_2.varchar)('email', { length: 255 }).notNull().unique(),
    age: (0, mysql_core_2.int)('age').notNull(),
    gender: (0, mysql_core_2.varchar)('gender', { length: 255 }).notNull(),
    nationality: (0, mysql_core_2.varchar)('nationality', { length: 50 }).notNull(),
    is_verified: (0, mysql_core_2.boolean)('is_verified').default(false),
    is_active: (0, mysql_core_2.boolean)('is_active').default(true),
    religion: (0, mysql_core_2.varchar)('religion', { length: 100 }).notNull(),
    bio: (0, mysql_core_2.varchar)('bio', { length: 120 }),
    about: (0, mysql_core_2.text)('about'),
    website: (0, mysql_core_2.text)('website'),
    avatar: (0, mysql_core_2.varchar)('avatar', { length: 255 }),
    coverImage: (0, mysql_core_2.varchar)('coverImage', { length: 255 }),
    hashed_password: (0, mysql_core_2.text)('hashed_password').notNull(),
    salt: (0, mysql_core_2.text)('salt').notNull(),
    languages: (0, mysql_core_2.json)('languages').$type(),
    interest: (0, mysql_core_2.json)('interest').$type(),
    location: (0, mysql_core_2.json)('location').$type(),
    education: (0, mysql_core_2.json)('education').$type(),
    job: (0, mysql_core_2.json)('job').$type(),
    createdAt: (0, mysql_core_1.timestamp)('createdAt').defaultNow().notNull(),
    friends: (0, mysql_core_2.json)('friends').$type().default([]),
    following: (0, mysql_core_2.json)('following').$type().default([]),
    followers: (0, mysql_core_2.json)('followers').$type().default([]),
});
exports.friendshipRequestTable = (0, mysql_core_2.mysqlTable)('friendshipRequest', {
    id: (0, mysql_core_2.int)('id').primaryKey().autoincrement().notNull(),
    from: (0, mysql_core_2.int)('from').notNull().references(() => exports.usersTable.id, { onDelete: 'cascade' }),
    to: (0, mysql_core_2.int)('to').notNull().references(() => exports.usersTable.id, { onDelete: 'cascade' }),
    status: (0, mysql_core_3.mysqlEnum)('status', ['confirmed', 'pending', 'declined']).default('pending').notNull(),
    createdAt: (0, mysql_core_1.timestamp)('createdAt').defaultNow().notNull()
}, (table) => ({
    uniquePair: (0, mysql_core_4.uniqueIndex)('unique_from_to').on(table.from, table.to),
}));
exports.postTables = (0, mysql_core_2.mysqlTable)('postTable', {
    id: (0, mysql_core_2.int)('id').primaryKey().autoincrement().unique().notNull(),
    caption: (0, mysql_core_2.text)('caption').notNull(),
    images: (0, mysql_core_2.json)('images').$type(),
    createdAt: (0, mysql_core_1.timestamp)('createdAt').defaultNow().notNull(),
    likes: (0, mysql_core_2.json)('likes').$type()
        .default([]),
    tags: (0, mysql_core_2.json)('tags').$type(),
    interest: (0, mysql_core_2.json)('interest').$type(),
    author: (0, mysql_core_2.int)('author').notNull().references(() => exports.usersTable.id, { onDelete: 'cascade' })
});

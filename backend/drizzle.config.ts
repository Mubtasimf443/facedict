/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import { defineConfig } from "drizzle-kit";
import { config } from 'dotenv'
config();

export default defineConfig({
    schema: "./src/drizzle/schema.ts",
    out: "./src/drizzle/migrations",

    dialect: "mysql",

    dbCredentials: {
        url: process.env.MYSQL_DB_URI!,
    },
    strict : true,
    verbose : true 
})
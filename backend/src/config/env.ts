/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import {config} from 'dotenv';
config();

export const PORT = process.env.PORT;
export const MYSQL_DB_DATABASE_NAME = process.env.MYSQL_DB_DATABASE_NAME;
export const MYSQL_DB_URI = process.env.MYSQL_DB_URI;
export const MYSQL_DB_HOST = process.env.MYSQL_DB_HOST;
export const MYSQL_DB_USERNAME = process.env.MYSQL_DB_USERNAME;
export const MYSQL_DB_PORT = process.env.MYSQL_DB_PORT;
export const MYSQL_DB_PASSWORD = process.env.MYSQL_DB_PASSWORD;
export const SMTP_USER = process.env.SMTP_USER;
export const SMTP_PASS = process.env.SMTP_PASS;
export const REDIS_URL = process.env.REDIS_URL;
export const REDIS_HOST = process.env.REDIS_HOST;
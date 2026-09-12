/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import {config} from 'dotenv';
config();
// SERVER
export const NODE_ENV = process.env.NODE_ENV;
export const PORT = process.env.PORT;
export const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN;
export const COOKIES_SAMESITE='lax';
// DATABASE
export const MYSQL_DB_DATABASE_NAME = process.env.MYSQL_DB_DATABASE_NAME;
export const MYSQL_DB_URI = process.env.MYSQL_DB_URI;
export const MYSQL_DB_HOST = process.env.MYSQL_DB_HOST;
export const MYSQL_DB_USERNAME = process.env.MYSQL_DB_USERNAME;
export const MYSQL_DB_PORT = process.env.MYSQL_DB_PORT;
export const MYSQL_DB_PASSWORD = process.env.MYSQL_DB_PASSWORD;
// SMTP
export const SMTP_USER = process.env.SMTP_USER;
export const SMTP_PASS = process.env.SMTP_PASS;
// REDIS
export const REDIS_URL = process.env.REDIS_URL;
export const REDIS_HOST = process.env.REDIS_HOST;
// CLOUDINARY
export const CLOUDINARY_CLOUD = process.env.CLOUDINARY_CLOUD;
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
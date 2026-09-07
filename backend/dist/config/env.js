"use strict";
/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CLOUDINARY_API_SECRET = exports.CLOUDINARY_API_KEY = exports.CLOUDINARY_CLOUD = exports.REDIS_HOST = exports.REDIS_URL = exports.SMTP_PASS = exports.SMTP_USER = exports.MYSQL_DB_PASSWORD = exports.MYSQL_DB_PORT = exports.MYSQL_DB_USERNAME = exports.MYSQL_DB_HOST = exports.MYSQL_DB_URI = exports.MYSQL_DB_DATABASE_NAME = exports.COOKIES_SAMESITE = exports.CLIENT_ORIGIN = exports.PORT = exports.NODE_ENV = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
// SERVER
exports.NODE_ENV = process.env.NODE_ENV;
exports.PORT = process.env.PORT;
exports.CLIENT_ORIGIN = process.env.CLIENT_ORIGIN;
exports.COOKIES_SAMESITE = 'none';
// DATABASE
exports.MYSQL_DB_DATABASE_NAME = process.env.MYSQL_DB_DATABASE_NAME;
exports.MYSQL_DB_URI = process.env.MYSQL_DB_URI;
exports.MYSQL_DB_HOST = process.env.MYSQL_DB_HOST;
exports.MYSQL_DB_USERNAME = process.env.MYSQL_DB_USERNAME;
exports.MYSQL_DB_PORT = process.env.MYSQL_DB_PORT;
exports.MYSQL_DB_PASSWORD = process.env.MYSQL_DB_PASSWORD;
// SMTP
exports.SMTP_USER = process.env.SMTP_USER;
exports.SMTP_PASS = process.env.SMTP_PASS;
// REDIS
exports.REDIS_URL = process.env.REDIS_URL;
exports.REDIS_HOST = process.env.REDIS_HOST;
// CLOUDINARY
exports.CLOUDINARY_CLOUD = process.env.CLOUDINARY_CLOUD;
exports.CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
exports.CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

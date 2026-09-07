"use strict";
/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const mysql2_1 = require("drizzle-orm/mysql2");
const env_1 = require("./env");
const db = (0, mysql2_1.drizzle)(env_1.MYSQL_DB_URI);
exports.default = db;

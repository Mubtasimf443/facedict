/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import 'dotenv/config';

import { drizzle } from "drizzle-orm/mysql2";
import { MYSQL_DB_URI } from './env';
const db = drizzle(MYSQL_DB_URI!);

export default db;
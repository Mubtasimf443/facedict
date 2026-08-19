/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import mysql from 'mysql2';
import { MYSQL_DB_DATABASE_NAME, MYSQL_DB_HOST, MYSQL_DB_PASSWORD, MYSQL_DB_PORT, MYSQL_DB_USERNAME } from './env';

export const db_pool = mysql.createConnection({
    host : MYSQL_DB_HOST,
    port:Number(MYSQL_DB_PORT),
    user :MYSQL_DB_USERNAME,
    password : MYSQL_DB_PASSWORD,
    database : MYSQL_DB_DATABASE_NAME
})
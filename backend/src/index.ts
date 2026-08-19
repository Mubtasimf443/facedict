/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import express, { Request, Response } from "express";
import { PORT } from "./config/env";
import { db_pool } from "./config/db";
import { mailer } from "./config/mailer";

const app = express();


app.use(express.json());
// let query =`ALTER TABLE User
// ADD religion Varchar(255);` 
// let data =db_pool.query(query, function (error , rasults , fields) {
//   console.log({error});
//   console.log({rasults});
//   console.log({fields});
// })


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
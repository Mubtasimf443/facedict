/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import express, { Request, Response } from "express";
import { CLIENT_ORIGIN, PORT } from "./config/env";
import authRouter from './routes/auth.route';
import assetRouter from './routes/assets.route';
import postRouter from './routes/post.route';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import db from "./config/db";
import { postTables, usersTable } from "./drizzle/schema";
import { profileRouter } from "./routes/profile.route";
import { count } from "drizzle-orm";

const app = express();
app.use(
  cors({
    origin: CLIENT_ORIGIN!,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);
// console.log(db.select({ count : count()}).from(usersTable).then(data => console.log({data})));
// console.log(db.update(usersTable).set({ avatar: 'https://i.pravatar.cc/150?img=32' }).then(data => console.log(data)));
// console.log(db.delete(usersTable).then(data => console.log(data)));

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser())
app.use('/api/auth', authRouter)
app.use('/api/assets', assetRouter)
app.use('/api/post', postRouter)
app.use('/api/profile', profileRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
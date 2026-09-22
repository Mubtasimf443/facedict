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
import { friendshipRequestTable, postTables, usersTable } from "./drizzle/schema";
import { profileRouter } from "./routes/profile.route";
import { count, eq } from "drizzle-orm";
import { friendsRouter } from "./routes/friendship.route";
import { redisClient } from "./config/radis";
import shuffleArray from "./utils/core/shuffleArray";

const app = express();
app.use(
  cors({
    origin: CLIENT_ORIGIN!,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser())
app.use('/api/auth', authRouter)
app.use('/api/assets', assetRouter)
app.use('/api/post', postRouter)
app.use('/api/profile', profileRouter);
app.use('/api/friends', friendsRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
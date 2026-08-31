/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import express, { Request, Response } from "express";
import { PORT } from "./config/env";
import authRouter from './routes/auth.route';
import assetRouter from './routes/assets.route';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import db from "./config/db";
import { usersTable } from "./drizzle/schema";

const app = express();
app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);
// console.log(db.delete(usersTable).then(data => console.log(data)));

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser())
app.use('/api/auth', authRouter)
app.use('/api/assets', assetRouter)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
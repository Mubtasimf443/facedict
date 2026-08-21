/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import express, { Request, Response } from "express";
import { PORT } from "./config/env";
import authRouter from './routes/auth.route'
import morgan from 'morgan'

const app = express();


app.use(express.json());
app.use(morgan('dev'));
app.use('/api/auth', authRouter)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
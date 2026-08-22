/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import { Router } from "express";
import userMiddleWare from "../middlewares/userMiddleWare";

const router =Router();
router.use(userMiddleWare)


export default router;
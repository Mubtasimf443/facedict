/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import { Router } from "express";
import postController from "../controllers/post.controller";
import userMiddleWare from "../middlewares/userMiddleWare";

const router =Router();
router.use(userMiddleWare);

router.get('/feed', postController.getFeed);
router.get('/create/post', postController.createPost);

export default router;
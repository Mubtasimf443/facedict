/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import { Router } from "express";
import postController from "../controllers/post.controller";
import userMiddleWare from "../middlewares/userMiddleWare";

const router =Router();
router.use(userMiddleWare);

router.get('/feed', postController.getFeed);
router.post('/create', postController.createPost);
router.get('/uploaded-posts/:userId', postController.getUserUplaodedPost);
router.get('/liked-posts/:userId', postController.getLikedPost);
router.post('/like/:postId', postController.likePost);
router.get('/media/:userId', postController.getUserPostedMedia);

export default router;
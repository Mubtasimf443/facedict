/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import { Router } from "express";
import userMiddleWare from "../middlewares/userMiddleWare";
import friendsController from "../controllers/friends.controller";

const router =Router();
router.use(userMiddleWare)

router.get('/suggestion', friendsController.friendSugesstion);
router.get('/list', friendsController.getFriendshipList);
router.post('/send/request', friendsController.sendFriendshipRequest);
router.post('/send/request/respond', friendsController.respondOnFriendshipRequest);
router.post('/send/request/delete', friendsController.deletePendingFriendshipRequest);

export {router as friendsRouter};
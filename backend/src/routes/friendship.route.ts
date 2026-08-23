/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import { Router } from "express";
import userMiddleWare from "../middlewares/userMiddleWare";
import friendsController from "../controllers/friends.controller";

const router =Router();
router.use(userMiddleWare)

router.get('/friendship/list', friendsController.getFriendshipList);
router.post('/friendship/send/request', friendsController.sendFriendshipRequest);
router.post('/friendship/send/request/respond', friendsController.respondOnFriendshipRequest);
router.post('/friendship/send/request/delete', friendsController.deletePendingFriendshipRequest);

export default router;
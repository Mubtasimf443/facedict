/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import { Router } from "express";
import userMiddleWare from "../middlewares/userMiddleWare";
import ProfileController from "../controllers/profile.controller";

const router = Router();
router.use(userMiddleWare);

router.get('/profie_details/:id', ProfileController.getUserData);
router.get('/friends', ProfileController.getUserFriendsList);
router.post('/add-education', ProfileController.addUserEducation);
router.post('/add-job', ProfileController.addUserJobHistory);

export { router as profileRouter };
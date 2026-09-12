/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import { Router } from "express";
import userMiddleWare from "../middlewares/userMiddleWare";
import ProfileController from "../controllers/profile.controller";

const router = Router();
router.use(userMiddleWare);

router.get('/profie_details/:id', ProfileController.getUserData);
router.post('/add-education', ProfileController.addUserEducation);

export { router as profileRouter };
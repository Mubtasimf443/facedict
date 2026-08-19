/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import { Router } from 'express';
import AuthController from '../controllers/auth.controller';


const router = Router();

router.post('/sign-up',AuthController.SignUp );
router.post('/login', AuthController.Login);
router.post('/logout',AuthController.Logout );

export default router;
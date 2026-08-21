/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import express from 'express';
import AuthController from '../controllers/auth.controller';


const router = express.Router();

router.post('/sign-up', AuthController.SignUp);
router.post('/sign-up-verification', AuthController.SignUpOtpVerification);
router.post('/login', AuthController.Login);
router.post('/logout',AuthController.Logout );

export default router;
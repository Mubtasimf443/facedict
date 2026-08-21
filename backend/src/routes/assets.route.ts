/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import {Router} from 'express';
import AssetsController from '../controllers/assets.controller';

const router = Router();

router.post('/upload/image' , AssetsController.UploadImage)

export default router;
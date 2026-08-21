/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import { v2 as cloudinary } from 'cloudinary';
import { CLOUDINARY_API_KEY as apikey, CLOUDINARY_API_SECRET as apiSecret, CLOUDINARY_CLOUD as cloudname } from './env';
import { log } from 'console';

cloudinary.config({
    cloud_name: cloudname,
    api_key: apikey,
    api_secret: apiSecret
});

export default async function uploadImageToCloudinary(path: string) {
    try {
        let response = await cloudinary.uploader.upload(path, {
            public_id: `${Date.now()}_${Math.floor(Math.random() * 1e9)}`,
            resource_type: 'image'
        });
        return response
    } catch (error) {
        log({ error })
        return false;
    }
}
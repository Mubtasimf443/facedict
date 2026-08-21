/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import { log } from "console";
import { Request, Response } from "express";
import formidable from 'formidable'
import path from 'path'
import { fileURLToPath } from 'url';
import { success } from "zod";
import uploadImageToCloudinary from "../config/cloudinary";


export default class AssetsController {
    static async UploadImage(req: Request, res: Response): Promise<any> {
        try {
            let DontSuffortMime = false;
            let options: formidable.Options = {
                uploadDir: path.resolve(__dirname, '../../uploads'),
                maxFiles: 1,
                allowEmptyFiles: false,
                maxFileSize: 10 * 1024 * 1024,
                filter: (file) => {
                    if (file.mimetype === 'image/png'
                        || file.mimetype === 'image/jpg'
                        || file.mimetype === 'image/jpeg'
                        || file.mimetype === 'image/webp') return true
                    DontSuffortMime = true
                    return false
                },
                filename: () => Date.now() + '_' + Math.floor(Math.random() * 1000000) + '.jpg'
            }
            await formidable(options).parse(req, async (error, fields, files) => {
                try {
                    if (DontSuffortMime) {
                        return res.status(400).json({ success: false, data: null, error : { message : 'do not support the mimetype'} });
                    }
                    if (error ) {
                        log({ error })
                        return res.status(400).json({ success: false, data: null, error });
                    }
                    if (!files?.image || files?.image?.length === 0) {
                        return res.status(400).json({ error: { message: "Please Uplaod A IMAGE" } })
                    }
                    let response =await uploadImageToCloudinary(files.image[0].filepath);
                    if (!response) {
                        return res.status(400).json({
                            error: {
                                message: 'failed to uplaod Image in cloudinary'
                            },
                            success : false ,
                            data : null
                        })
                    }
                    return res.status(200).json({ data: { url: response.url }, success: true, error: null })
                    
                } catch (error) {
                    log({error})
                }
            });
        } catch (error) {
            return res.status(400).json({})
        }
    }
}
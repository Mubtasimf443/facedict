"use strict";
/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const console_1 = require("console");
const formidable_1 = __importDefault(require("formidable"));
const path_1 = __importDefault(require("path"));
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const fs_1 = require("fs");
class AssetsController {
    static async UploadImage(req, res) {
        try {
            let DontSuffortMime = false;
            let options = {
                uploadDir: path_1.default.resolve(__dirname, '../../uploads'),
                maxFiles: 1,
                allowEmptyFiles: false,
                maxFileSize: 10 * 1024 * 1024,
                filter: (file) => {
                    if (file.mimetype === 'image/png'
                        || file.mimetype === 'image/jpg'
                        || file.mimetype === 'image/jpeg'
                        || file.mimetype === 'image/webp')
                        return true;
                    DontSuffortMime = true;
                    return false;
                },
                filename: () => Date.now() + '_' + Math.floor(Math.random() * 1000000) + '.jpg'
            };
            await (0, formidable_1.default)(options).parse(req, async (error, fields, files) => {
                try {
                    if (DontSuffortMime) {
                        return res.status(400).json({ success: false, data: null, error: { message: 'do not support the mimetype' } });
                    }
                    if (error) {
                        (0, console_1.log)({ error });
                        return res.status(400).json({ success: false, data: null, error });
                    }
                    if (!files?.image || files?.image?.length === 0) {
                        return res.status(400).json({ error: { message: "Please Uplaod A IMAGE" } });
                    }
                    let response = await (0, cloudinary_1.default)(files.image[0].filepath);
                    if (!response) {
                        return res.status(400).json({
                            error: {
                                message: 'failed to uplaod Image in cloudinary'
                            },
                            success: false,
                            data: null
                        });
                    }
                    (0, fs_1.unlinkSync)(files.image[0].filepath);
                    return res.status(200).json({ data: { url: response.url }, success: true, error: null });
                }
                catch (error) {
                    (0, console_1.log)({ error });
                }
            });
        }
        catch (error) {
            return res.status(400).json({});
        }
    }
}
exports.default = AssetsController;

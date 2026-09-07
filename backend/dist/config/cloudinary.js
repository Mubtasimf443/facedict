"use strict";
/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = uploadImageToCloudinary;
const cloudinary_1 = require("cloudinary");
const env_1 = require("./env");
const console_1 = require("console");
cloudinary_1.v2.config({
    cloud_name: env_1.CLOUDINARY_CLOUD,
    api_key: env_1.CLOUDINARY_API_KEY,
    api_secret: env_1.CLOUDINARY_API_SECRET
});
async function uploadImageToCloudinary(path) {
    try {
        let response = await cloudinary_1.v2.uploader.upload(path, {
            public_id: `${Date.now()}_${Math.floor(Math.random() * 1e9)}`,
            resource_type: 'image'
        });
        return response;
    }
    catch (error) {
        (0, console_1.log)({ error });
        return false;
    }
}

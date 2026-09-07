"use strict";
/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const assets_controller_1 = __importDefault(require("../controllers/assets.controller"));
const router = (0, express_1.Router)();
router.post('/upload/image', assets_controller_1.default.UploadImage);
exports.default = router;

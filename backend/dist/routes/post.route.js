"use strict";
/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const post_controller_1 = __importDefault(require("../controllers/post.controller"));
const userMiddleWare_1 = __importDefault(require("../middlewares/userMiddleWare"));
const router = (0, express_1.Router)();
router.use(userMiddleWare_1.default);
router.get('/feed', post_controller_1.default.getFeed);
router.get('/create/post', post_controller_1.default.createPost);
exports.default = router;

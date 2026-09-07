"use strict";
/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userMiddleWare_1 = __importDefault(require("../middlewares/userMiddleWare"));
const friends_controller_1 = __importDefault(require("../controllers/friends.controller"));
const router = (0, express_1.Router)();
router.use(userMiddleWare_1.default);
router.get('/friendship/list', friends_controller_1.default.getFriendshipList);
router.post('/friendship/send/request', friends_controller_1.default.sendFriendshipRequest);
router.post('/friendship/send/request/respond', friends_controller_1.default.respondOnFriendshipRequest);
router.post('/friendship/send/request/delete', friends_controller_1.default.deletePendingFriendshipRequest);
exports.default = router;

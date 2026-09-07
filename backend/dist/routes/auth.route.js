"use strict";
/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
const userMiddleWare_1 = __importDefault(require("../middlewares/userMiddleWare"));
const router = express_1.default.Router();
router.post('/signup', auth_controller_1.default.SignUp);
router.post('/sign-up-verification', auth_controller_1.default.SignUpOtpVerification);
router.post('/login', auth_controller_1.default.Login);
router.post('/logout', auth_controller_1.default.Logout);
router.get('/user-details', userMiddleWare_1.default, auth_controller_1.default.userDetails);
exports.default = router;

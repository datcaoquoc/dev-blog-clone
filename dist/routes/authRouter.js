"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = __importDefault(require("../controller/authController"));
const valid_1 = require("../middelware/valid");
const auth_1 = __importDefault(require("../middelware/auth"));
const router = express_1.default.Router();
router.post('/register', valid_1.validRegister, authController_1.default.register);
router.post('/active', authController_1.default.acctiveAccount);
router.post('/login', authController_1.default.login);
router.get('/logout', auth_1.default, authController_1.default.logout);
router.get('/refresh_token', authController_1.default.refreshtoken);
router.post('/google_login', authController_1.default.googleLogin);
router.post('/facebook_login', authController_1.default.facebooklogin);
router.post('/forgot_password', authController_1.default.forgotPassword);
exports.default = router;

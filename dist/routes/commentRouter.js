"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const commentControler_1 = __importDefault(require("../controller/commentControler"));
const auth_1 = __importDefault(require("../middelware/auth"));
const router = express_1.default.Router();
router.post('/create-comment', auth_1.default, commentControler_1.default.createComment);
router.get('/get-comment/:id', commentControler_1.default.getComments);
router.post('/reply_comment', auth_1.default, commentControler_1.default.replyComment);
router.patch('/update-comment/:id', auth_1.default, commentControler_1.default.updateComment);
router.delete('/delete_comment/:id', auth_1.default, commentControler_1.default.deleteComment);
exports.default = router;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const likeControllor_1 = __importDefault(require("../controller/likeControllor"));
const auth_1 = __importDefault(require("../middelware/auth"));
const router = express_1.default.Router();
// like bài viết
router.patch('/like-blog', auth_1.default, likeControllor_1.default.likeBlog);
// un like bài viết
router.patch('/unlike-blog', auth_1.default, likeControllor_1.default.unLikeBlog);
// like bình luận
router.patch('/like-comment', auth_1.default, likeControllor_1.default.likeComment);
exports.default = router;

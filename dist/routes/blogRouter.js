"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const blogController_1 = __importDefault(require("../controller/blogController"));
const auth_1 = __importDefault(require("../middelware/auth"));
const valid_1 = require("../middelware/valid");
const router = express_1.default.Router();
router.post('/create-blog', auth_1.default, valid_1.validBlog, blogController_1.default.createBlog);
router.patch('/update-blog', auth_1.default, valid_1.validBlog, blogController_1.default.updateBlog);
router.patch('/delete-blog', auth_1.default, blogController_1.default.deleteBlog);
router.get('/blog/:idblog', blogController_1.default.getBlogById);
router.patch('/private-blog', auth_1.default, blogController_1.default.privateBlog);
router.patch('/public-blog', auth_1.default, blogController_1.default.publicBlog);
router.patch('/view-blog', auth_1.default, blogController_1.default.viewBlog);
router.patch('/mod-remove-blog', auth_1.default, blogController_1.default.modRemoveBlog);
exports.default = router;

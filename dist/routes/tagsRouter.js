"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tagsControllor_1 = __importDefault(require("../controller/tagsControllor"));
const router = express_1.default.Router();
router.get('/get-blog-by-tag/:id/:page', tagsControllor_1.default.getBlogbytag);
router.get('/get-infor-tag/:id', tagsControllor_1.default.getInforTags);
router.get('/get-list-tag', tagsControllor_1.default.getListtag);
router.get('/get-list-tag-top', tagsControllor_1.default.getListtagtop);
exports.default = router;

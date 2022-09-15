"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const freeControllor_1 = __importDefault(require("../controller/freeControllor"));
const authhomepage_1 = __importDefault(require("../middelware/authhomepage"));
const router = express_1.default.Router();
router.get('/list-home', authhomepage_1.default, freeControllor_1.default.getListHomePage);
router.get('/list-blogest-tag', authhomepage_1.default, freeControllor_1.default.getBlogTallestinTag);
router.get('/search', freeControllor_1.default.search);
exports.default = router;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminController_1 = __importDefault(require("../controller/adminController"));
const checkrole_1 = __importDefault(require("../middelware/checkrole"));
const auth_1 = __importDefault(require("../middelware/auth"));
const valid_1 = require("../middelware/valid");
const router = express_1.default.Router();
router.post('/create-tags', auth_1.default, checkrole_1.default, valid_1.validTag, adminController_1.default.createTags);
router.post('/addmoderators', auth_1.default, checkrole_1.default, adminController_1.default.addmoderators);
// router.post('/add-mod-for-tag',auth,checkrole, adminController.addModForTag)
router.post('/remove-mod-for-tag', auth_1.default, checkrole_1.default, adminController_1.default.removeModForTag);
router.get('/get-listtag', auth_1.default, checkrole_1.default, adminController_1.default.getListtagadmin);
router.patch('/update-tag', auth_1.default, checkrole_1.default, adminController_1.default.updateTags);
router.patch('/lockTag', auth_1.default, checkrole_1.default, adminController_1.default.lockTag);
router.patch('/unlockTag', auth_1.default, checkrole_1.default, adminController_1.default.unlockTag);
router.get('/homeadmin', auth_1.default, checkrole_1.default, adminController_1.default.getHomeDashbroadAdmin);
router.get('/getlistusermanager', auth_1.default, checkrole_1.default, adminController_1.default.getListUsermanager);
router.patch('/lockuser', auth_1.default, checkrole_1.default, adminController_1.default.lockUser);
router.patch('/unlockuser', auth_1.default, checkrole_1.default, adminController_1.default.unlockUser);
router.get('/get-report', auth_1.default, checkrole_1.default, adminController_1.default.getReport);
router.patch('/delete-report', auth_1.default, checkrole_1.default, adminController_1.default.readReport);
router.get('/get-list-mod', auth_1.default, checkrole_1.default, adminController_1.default.getListmod);
router.patch('/removed-mod', auth_1.default, checkrole_1.default, adminController_1.default.removedmod);
router.get('/getlist-blog-remove', auth_1.default, checkrole_1.default, adminController_1.default.getBlogremoved);
exports.default = router;

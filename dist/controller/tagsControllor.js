"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const blogModel_1 = __importDefault(require("../models/blogModel"));
const tagsModel_1 = __importDefault(require("../models/tagsModel"));
const tagsController = {
    getBlogbytag: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { page, id } = req.params;
            const { sort } = req.query;
            const blogbytag = yield blogModel_1.default.find({ "tags": { "$in": id }, is_detroy: false })
                .populate("tags")
                .populate("poster")
                .sort({ "createdAt": Number(sort) })
                .limit(3)
                .skip(3 * (Number(page) - 1));
            res.status(200).json({ blogbytag });
        }
        catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    }),
    getInforTags: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const infortag = yield tagsModel_1.default.findOne({ _id: id })
                .populate("moderators");
            const favoritePosts = yield blogModel_1.default.find({ "tags": { "$in": id }, is_detroy: false })
                .populate("poster")
                .sort({ "likecount": -1 })
                .limit(3);
            res.status(200).json({ infortag, favoritePosts });
        }
        catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    }),
    getListtag: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const listtag = yield tagsModel_1.default.find({ is_destroy: false }).sort({ "total_blog": -1 });
            res.status(200).json({ listtag });
        }
        catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    }),
    getListtagtop: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const listtag = yield tagsModel_1.default.find({}).sort({ "total_blog": -1 });
            res.status(200).json({ listtag });
        }
        catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    })
};
exports.default = tagsController;

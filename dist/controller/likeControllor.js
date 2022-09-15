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
const notifyModel_1 = __importDefault(require("../models/notifyModel"));
const likeModel_1 = __importDefault(require("../models/likeModel"));
const commentModel_1 = __importDefault(require("../models/commentModel"));
const index_1 = require("../index");
const likeController = {
    // thích bài viết
    likeBlog: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        if (!req.user)
            return res.status(400).json({ msg: "Xác thực thất bại" });
        try {
            const { idblog, id_user_blog } = req.body;
            const newNotifi = new notifyModel_1.default({
                message: `thích bài viết của bạn`,
                idpost: idblog,
                to_user: id_user_blog,
                from_user: req.user._id,
                type: `like`,
            });
            // check xem người dùng đã like bài này chưa
            const checklike = yield likeModel_1.default.findOne({
                iduser: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id.toString(),
                idblog,
            });
            // nếu đã like thì return
            if (checklike)
                return res.status(400).json({ msg: "Truy vấn thất bại" });
            // nếu chưa lưu id user và id blog vào db Likes
            if (req.user._id.toString() !== id_user_blog) {
                // kiểm tra đã có thông báo bình luận bài viết này của người này chưa
                const checkNotilike = yield notifyModel_1.default.findOne({ idpost: idblog,
                    from_user: req.user._id,
                    type: `like` });
                // nếu chưa
                if (!checkNotilike) {
                    newNotifi.save();
                    index_1.io.sockets.in(`${id_user_blog}`).emit('new_noti', { msg: "noti" });
                }
            }
            const likeNew = new likeModel_1.default({
                iduser: (_b = req.user) === null || _b === void 0 ? void 0 : _b._id.toString(),
                idblog,
            });
            yield likeNew.save();
            // cập nhật tổng like của blog
            yield blogModel_1.default.findOneAndUpdate({ _id: idblog }, { $inc: { likecount: 1 } });
            return res.status(200).json({ msg: "ok" });
        }
        catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    }),
    // hủy thích bài viết
    unLikeBlog: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _c, _d;
        if (!req.user)
            return res.status(400).json({ msg: "Xác thực thất bại" });
        try {
            const { idblog } = req.body;
            console.log(idblog);
            // check user đã like chưa
            const checklike = yield likeModel_1.default.findOne({
                iduser: (_c = req.user) === null || _c === void 0 ? void 0 : _c._id.toString(),
                idblog,
            });
            // nếu chưa thì return
            if (!checklike)
                return res.status(400).json({ msg: "Truy vấn thất bại" });
            // nếu đã like thì xóa document chưa id user và id blog tương ứng
            yield likeModel_1.default.findOneAndDelete({
                iduser: (_d = req.user) === null || _d === void 0 ? void 0 : _d._id.toString(),
                idblog,
            });
            // cập nhật lại tổng số like của blog
            yield blogModel_1.default.findOneAndUpdate({ _id: idblog }, { $inc: { likecount: -1 } });
            return res.status(200).json({ msg: "ok" });
        }
        catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    }),
    // like or unlike comment
    likeComment: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _e, _f, _g;
        if (!req.user)
            return res.status(400).json({ msg: "Xác thực thất bại" });
        try {
            const { idcomment } = req.body;
            const checklike = yield commentModel_1.default.findOne({
                _id: idcomment,
                user_like: (_e = req.user) === null || _e === void 0 ? void 0 : _e._id.toString(),
            });
            if (checklike) {
                yield commentModel_1.default.findOneAndUpdate({ _id: idcomment }, { $pull: { user_like: (_f = req.user) === null || _f === void 0 ? void 0 : _f._id.toString() }, $inc: { likecount: -1 } });
            }
            else {
                yield commentModel_1.default.findOneAndUpdate({ _id: idcomment }, { $push: { user_like: (_g = req.user) === null || _g === void 0 ? void 0 : _g._id.toString() }, $inc: { likecount: 1 } });
            }
            return res.status(200).json({ msg: "ok" });
        }
        catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    }),
};
exports.default = likeController;

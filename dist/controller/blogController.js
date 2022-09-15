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
const notifyModel_1 = __importDefault(require("../models/notifyModel"));
const likeModel_1 = __importDefault(require("../models/likeModel"));
const moment_1 = __importDefault(require("moment"));
const blogController = {
    // tạo bài đăng
    createBlog: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.user)
            return res.status(400).json({ msg: "Xác thực thất bại" });
        try {
            const { title, content, desc, img, tag } = req.body;
            const user = req.user;
            const newBlog = new blogModel_1.default({
                title,
                content,
                // description: desc,
                imagepost: img,
                tags: tag,
                poster: user === null || user === void 0 ? void 0 : user._id.toString()
            });
            // tìm bài viết mới nhất của user
            const checkblog = yield blogModel_1.default.findOne({ poster: user === null || user === void 0 ? void 0 : user._id.toString() }).limit(1).sort({ createdAt: -1 });
            // lấy khoảng thời gian user từ bài viết mới nhất của user đến khoảng thời gian hiện tại
            if (checkblog) {
                const checktime = (0, moment_1.default)().diff(checkblog.createdAt, 'minutes');
                // kiểm tra thời gian đăng của bài mới nhất đã quá 30p chưa
                if (checktime < 1) {
                    return res.status(400).json({ msg: `Để tránh tình trạng spam bài đăng trên trang vui lòng đăng bài viết sau ${30 - checktime} phút nữa` });
                }
            }
            const listnoti = user.follower.map((iduser) => {
                return {
                    message: `vừa đăng một bài viết mới`,
                    idpost: newBlog._id,
                    to_user: iduser,
                    from_user: user._id,
                    type: `blog`
                };
            });
            // console.log(listnoti)
            yield newBlog.save();
            yield notifyModel_1.default.insertMany(listnoti);
            // tăng tổng số bài đăng thuộc các thẻ tag
            yield tagsModel_1.default.updateMany({ _id: { $in: tag } }, { $inc: { total_blog: 1 } });
            return res.status(200).json({ msg: "Đã tạo bài đăng" });
        }
        catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    }),
    // sửa bài đăng
    updateBlog: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.user)
            return res.status(400).json({ msg: "Xác thực thất bại" });
        try {
            const { title, content, desc, img, tag, idblog } = req.body;
            const user = req.user;
            // kiểm tra bài đăng có tồn tại không, đồng thời lấy ra danh sách tag của bài đăng
            const checkblog = yield blogModel_1.default.findOne({ _id: idblog, poster: user === null || user === void 0 ? void 0 : user._id.toString() }, {
                _id: 0,
                content: 0,
                title: 0,
                description: 0,
                imagepost: 0,
                poster: 0,
                views: 0,
                type: 0,
                is_detroy: 0,
                createdAt: 0,
                updatedAt: 0,
                __v: 0
            });
            // kiểm tra tag khi update và tag trong db có sự thay đổi không
            const checktag = JSON.stringify(checkblog.tags) === JSON.stringify(tag);
            // nếu không => update user như bình thường
            if (checktag) {
                const updateblog = yield blogModel_1.default.findOneAndUpdate({ _id: idblog, poster: user === null || user === void 0 ? void 0 : user._id.toString() }, {
                    title,
                    content,
                    // description: desc,
                    imagepost: img,
                    tags: tag,
                });
                if (!updateblog)
                    return res.status(400).json({ msg: "Xác thực không hợp lệ" });
            }
            else {
                // nếu có sự thay đổi thì update bài đăng đồng thời giảm tổng số bài đăng của các thẻ tag bị loại bỏ
                // và thêm lại tăng tổng số bài đăng của tag mới thêm lên
                const updateblog = yield blogModel_1.default.findOneAndUpdate({ _id: idblog, poster: user === null || user === void 0 ? void 0 : user._id.toString() }, {
                    title,
                    content,
                    // description: desc,
                    imagepost: img,
                    tags: tag,
                });
                if (!updateblog)
                    return res.status(400).json({ msg: "Xác thực không hợp lệ" });
                yield tagsModel_1.default.updateMany({ _id: { $in: checkblog.tags } }, { $inc: { total_blog: Number(-1) } });
                yield tagsModel_1.default.updateMany({ _id: { $in: tag } }, { $inc: { total_blog: 1 } });
            }
            return res.status(200).json({ msg: "Cập nhật bài viết thành công" });
        }
        catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    }),
    deleteBlog: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.user)
            return res.status(400).json({ msg: "Xác thực thất bại" });
        try {
            const { idblog } = req.body;
            const user = req.user;
            const delBlog = yield blogModel_1.default.findOneAndUpdate({ _id: idblog }, {
                is_detroy: true
            });
            if (!delBlog)
                return res.status(400).json({ msg: "Xác thực không hợp lệ" });
            res.status(200).json({ msg: "Xóa bài viết thành công" });
        }
        catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    }),
    privateBlog: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.user)
            return res.status(400).json({ msg: "Xác thực thất bại" });
        try {
            const idblog = req.body.idblog;
            yield blogModel_1.default.findOneAndUpdate({ _id: idblog }, {
                status: "Private", pin: false
            });
            res.status(200).json({ msg: "Đã thêm blog vào blog riêng tư" });
        }
        catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    }),
    publicBlog: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.user)
            return res.status(400).json({ msg: "Xác thực thất bại" });
        try {
            const idblog = req.body.idblog;
            yield blogModel_1.default.findOneAndUpdate({ _id: idblog }, {
                status: "Public"
            });
            res.status(200).json({ msg: "Đã thêm blog vào blog riêng tư" });
        }
        catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    }),
    getBlogById: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var checklike = false;
        try {
            const { idblog } = req.params;
            const iduser = req.query.iduser;
            const blog = yield blogModel_1.default.findOne({ _id: idblog, status: "Public", is_detroy: false })
                .populate("poster", "_id name story location work learning createdAt avatar")
                .populate("tags", "_id name moderators");
            var tagblog = yield blog.tags.map((tag) => tag._id.toString());
            const blogSameUser = yield blogModel_1.default.find({ poster: blog.poster._id, is_detroy: false, status: "Public", _id: { $ne: idblog } })
                .sort({ "createdAt": 1 })
                .limit(3)
                .populate("tags", "_id name");
            const blogSameTag = yield blogModel_1.default.find({ tags: { "$in": tagblog }, is_detroy: false, status: "Public", _id: { $ne: idblog } })
                .populate("poster", "_id name story location work learning createdAt")
                .populate("tags", "_id name")
                .limit(4)
                .sort({ "likecount": 1 });
            if (iduser !== "undefined") {
                const checklikeuser = yield likeModel_1.default.findOne({ idblog: idblog, iduser: iduser });
                if (checklikeuser) {
                    var checklike = true;
                }
            }
            res.status(200).json({ blog, blogSameUser, blogSameTag, liked: checklike });
        }
        catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    }),
    modRemoveBlog: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const { idblog, message } = req.body;
            yield blogModel_1.default.findOneAndUpdate({ _id: idblog }, { is_detroy: true, removed: { idmod: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id, message: message } });
            res.status(200).json("ok");
        }
        catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    }),
    viewBlog: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _b;
        try {
            const { idblog } = req.body;
            yield blogModel_1.default.findOneAndUpdate({ _id: idblog }, { $push: { viewer: (_b = req.user) === null || _b === void 0 ? void 0 : _b._id.toString() } });
            res.status(200).json("ok");
        }
        catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    })
};
exports.default = blogController;

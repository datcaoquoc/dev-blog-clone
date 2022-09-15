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
const userModel_1 = __importDefault(require("../models/userModel"));
const notifyModel_1 = __importDefault(require("../models/notifyModel"));
const commentModel_1 = __importDefault(require("../models/commentModel"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const tagsModel_1 = __importDefault(require("../models/tagsModel"));
const reportModel_1 = __importDefault(require("../models/reportModel"));
const index_1 = require("../index");
const userController = {
    // cập nhật trang cá nhân
    updateProfile: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.user)
            return res.status(400).json({ msg: "Xác thực thất bại" });
        try {
            const { name, story, location, web_url, learning, work, education, } = req.body;
            yield userModel_1.default.findOneAndUpdate({ _id: req.user._id }, {
                name,
                story,
                location,
                web_url,
                learning,
                work,
                education,
            });
            res.json({ msg: "Cập nhật tài khoản thành công" });
        }
        catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    }),
    updateProfileImage: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.user)
            return res.status(400).json({ msg: "Xác thực thất bại" });
        try {
            const { avatar } = req.body;
            yield userModel_1.default.findOneAndUpdate({ _id: req.user._id }, {
                avatar
            });
            res.json({ msg: "Cập nhật Ảnh đại diện thành công" });
        }
        catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    }),
    updateProfileCover: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.user)
            return res.status(400).json({ msg: "Xác thực thất bại" });
        try {
            const { coverimage } = req.body;
            yield userModel_1.default.findOneAndUpdate({ _id: req.user._id }, {
                coverimage
            });
            res.json({ msg: "Cập nhật Ảnh Bìa thành công" });
        }
        catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    }),
    resetPassword: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.user)
            return res.status(400).json({ msg: "Invalid Authentication." });
        try {
            const { password } = req.body;
            const passwordHash = yield bcrypt_1.default.hash(password, 12);
            yield userModel_1.default.findOneAndUpdate({ _id: req.user._id }, {
                password: passwordHash,
            });
            res.json({ msg: "Đổi mật khẩu thành công" });
        }
        catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    }),
    // đổi mật khẩu
    changePassword: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.user)
            return res.status(400).json({ msg: "Xác thực thất bại" });
        // if (req.user.type !== "register")
        //   return res
        //     .status(400)
        //     .json({ msg: "Chức năng không dành cho tài khoản đăng ký nhanh..." });
        try {
            const { password, passwordnew } = req.body;
            // const hassPassword = await bcrypt.hash(password, 12);
            const data = yield userModel_1.default.findOne({ _id: req.user._id });
            if (data) {
                bcrypt_1.default.compare(password, data.password, (err, result) => __awaiter(void 0, void 0, void 0, function* () {
                    if (result) {
                        const hassPassword = yield bcrypt_1.default.hash(passwordnew, 12);
                        yield userModel_1.default.findOneAndUpdate({ _id: data._id }, {
                            password: hassPassword,
                        });
                        res.status(200).json({ msg: "Đổi mật khẩu thành công" });
                    }
                    else {
                        return res.status(400).json({ msg: "Mật khẩu không chính xác" });
                    }
                }));
            }
        }
        catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    }),
    // theo dõi tag
    followTag: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        if (!req.user)
            return res.status(400).json({ msg: "Xác thực thất bại" });
        try {
            const { idtag } = req.body;
            const { my_tags } = req.user;
            const userExists = my_tags.some((tag) => tag.idtag == idtag);
            if (userExists)
                return res.status(400).json({ msg: "Truy vấn thất bại" });
            const result = yield userModel_1.default.findOneAndUpdate({ _id: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id.toString() }, { $push: { my_tags: { idtag: idtag } } }, { new: true });
            return res.status(200).json({ result });
        }
        catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    }),
    // bỏ theo dõi tag
    unfollowTag: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _b, _c;
        if (!req.user)
            return res.status(400).json({ msg: "Xác thực thất bại" });
        try {
            const { idtag } = req.body;
            console.log((_b = req.user) === null || _b === void 0 ? void 0 : _b._id.toString());
            const { my_tags } = req.user;
            if (Array.isArray(my_tags)) {
                // kiểm tra xem người dùng có đang theo dõi thẻ tag này không, nếu không thì return
                const userExists = my_tags.some((tag) => tag.idtag == idtag);
                if (!userExists)
                    return res.status(400).json({ msg: "Truy vấn thất bại" });
                const result = yield userModel_1.default.findOneAndUpdate({ _id: (_c = req.user) === null || _c === void 0 ? void 0 : _c._id.toString() }, { $pull: { my_tags: { idtag: idtag } } }, { new: true });
                return res.status(200).json({ result });
            }
        }
        catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    }),
    // theo dõi người dùng
    followUser: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _d, _e, _f;
        if (!req.user)
            return res.status(400).json({ msg: "Xác thực thất bại" });
        try {
            const { iduserfolow } = req.body;
            const { block_account, my_follow } = req.user;
            const newNotifi = new notifyModel_1.default({
                message: `đã theo dõi bạn`,
                to_user: iduserfolow,
                from_user: req.user._id,
                type: `follow`,
            });
            // // check xem đã follow người đó chưa , nếu đã follow thì return
            if (my_follow.includes(iduserfolow))
                return res.status(400).json({ msg: "Truy vấn thất bại" });
            // // kiểm tra user muốn follow có trong danh sách chặn không, nếu có thì xóa user khỏi danh sách chặn
            if (block_account.includes(iduserfolow)) {
                yield userModel_1.default.findOneAndUpdate({ _id: (_d = req.user) === null || _d === void 0 ? void 0 : _d._id.toString() }, { $pull: { block_account: iduserfolow } });
            }
            // thêm id user muốn follow vào danh sách
            yield userModel_1.default.findOneAndUpdate({ _id: (_e = req.user) === null || _e === void 0 ? void 0 : _e._id.toString() }, { $push: { my_follow: iduserfolow } });
            const checkfollow = yield notifyModel_1.default.findOne({
                to_user: iduserfolow,
                from_user: req.user._id,
                type: `follow`,
            });
            if (!checkfollow) {
                newNotifi.save();
                index_1.io.sockets.in(`${iduserfolow}`).emit('new_noti', { msg: "noti" });
            }
            // cập nhật tổng số người theo dõi của user bạn follow
            yield userModel_1.default.findOneAndUpdate({ _id: iduserfolow }, { $push: { follower: (_f = req.user) === null || _f === void 0 ? void 0 : _f._id.toString() } });
            return res.status(200).json({ msg: "Đã theo dõi người dùng" });
        }
        catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    }),
    // bỏ theo dõi nguwoif dùng
    unfollowUser: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _g, _h;
        if (!req.user)
            return res.status(400).json({ msg: "Xác thực thất bại" });
        try {
            const { iduserfolow } = req.body;
            const { my_follow } = req.user;
            if (!my_follow.includes(iduserfolow))
                return res.status(400).json({ msg: "truy vấn thất bại" });
            yield userModel_1.default.findOneAndUpdate({ _id: (_g = req.user) === null || _g === void 0 ? void 0 : _g._id.toString() }, { $pull: { my_follow: iduserfolow } });
            yield userModel_1.default.findOneAndUpdate({ _id: iduserfolow }, { $pull: { follower: (_h = req.user) === null || _h === void 0 ? void 0 : _h._id.toString() } });
            return res.status(200).json({ msg: "Đã bỏ theo dõi người dùng" });
        }
        catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    }),
    // chặn người dùng
    blockUsers: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _j, _k;
        if (!req.user)
            return res.status(400).json({ msg: "Xác thực thất bại" });
        try {
            const { iduser } = req.body;
            const { my_follow, block_account } = req.user;
            // kiểm tra xem có đang theo dõi người dùng này không, nếu có thì bỏ theo dõi
            // đồng thời cập nhật lại tổng số follower của người dùng đó
            if (my_follow.includes(iduser)) {
                yield userModel_1.default.findOneAndUpdate({ _id: (_j = req.user) === null || _j === void 0 ? void 0 : _j._id.toString() }, { $pull: { my_follow: iduser } });
                yield userModel_1.default.findOneAndUpdate({ _id: iduser }, { $inc: { follower: -1 } });
            }
            // kiểm tra xem người dùng có nằm trong danh sách không, nếu đã nằm trong danh sách chặn thì return
            if (block_account.includes(iduser))
                return res.status(400).json({ msg: "Truy vấn thất bại" });
            yield userModel_1.default.findOneAndUpdate({ _id: (_k = req.user) === null || _k === void 0 ? void 0 : _k._id.toString() }, { $push: { block_account: iduser } });
            return res.status(200).json({ msg: "Đã chặn người dùng" });
        }
        catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    }),
    //lưu bài
    savePost: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _l;
        if (!req.user)
            return res.status(400).json({ msg: "Xác thực thất bại" });
        try {
            const { idblog } = req.body;
            const { post_saved } = req.user;
            if (post_saved.includes(idblog))
                return res.status(400).json({ msg: "Truy vấn thất bại" });
            yield userModel_1.default.findOneAndUpdate({ _id: (_l = req.user) === null || _l === void 0 ? void 0 : _l._id.toString() }, { $push: { post_saved: idblog } });
            yield blogModel_1.default.findOneAndUpdate({ _id: idblog }, { $inc: { saved: 1 } });
            return res.status(200).json({ msg: "Đã lưu bài viết" });
        }
        catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    }),
    // hủy lưu bài
    unsavePost: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _m;
        if (!req.user)
            return res.status(400).json({ msg: "Xác thực thất bại" });
        try {
            const { idblog } = req.body;
            const { post_saved } = req.user;
            if (!post_saved.includes(idblog))
                return res.status(400).json({ msg: "Truy vấn thất bại" });
            yield userModel_1.default.findOneAndUpdate({ _id: (_m = req.user) === null || _m === void 0 ? void 0 : _m._id.toString() }, { $pull: { post_saved: idblog } });
            yield blogModel_1.default.findOneAndUpdate({ _id: idblog }, { $inc: { saved: -1 } });
            return res.status(200).json({ msg: "Đã hủy lưu bài viết" });
        }
        catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    }),
    // ưu tiên thẻ tag
    tagPriority: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _o;
        if (!req.user)
            return res.status(400).json({ msg: "Xác thực thất bại" });
        try {
            const { idtag, prioritizecount } = req.body;
            const { my_tags } = req.user;
            const userExists = my_tags.some((tag) => tag.idtag == idtag);
            if (!userExists)
                return res.status(400).json({ msg: "Truy vấn thất bại" });
            const abc = yield userModel_1.default.findOneAndUpdate({ _id: (_o = req.user) === null || _o === void 0 ? void 0 : _o._id.toString(), "my_tags.idtag": idtag }, { $set: { "my_tags.$.prioritize": prioritizecount } }, { new: true });
            return res.status(200).json({ msg: abc });
        }
        catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    }),
    // ghim bài
    pinBlog: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.user)
            return res.status(400).json({ msg: "Xác thực thất bại" });
        try {
            const { idblog } = req.body;
            console.log(idblog);
            // kiểm tra xem tổng sôs bài viết được ghim là bao nhiêu
            const countpin = yield blogModel_1.default.count({
                pin: true,
                poster: req.user._id.toString(),
            });
            // nếu quá 5 bài thì return
            if (countpin > 3)
                return res.status(400).json({ msg: "Tối đa 5 bài viết được ghim" });
            // kiểm tra bài viết đó đã được ghim chưa
            const checkblog = yield blogModel_1.default.findOne({ pin: true, _id: idblog });
            // nếu rồi thì return
            if (checkblog)
                return res.status(400).json({ msg: "Bài viết đã được ghim" });
            // cập nhật field pin thành true
            yield blogModel_1.default.findOneAndUpdate({ _id: idblog, poster: req.user._id.toString() }, { pin: true });
            return res.status(200).json({ msg: "Đã ghim bài viết" });
        }
        catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    }),
    // gỡ ghim bài
    unpinBlog: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.user)
            return res.status(400).json({ msg: "Xác thực thất bại" });
        try {
            const { idblog } = req.body;
            const checkblog = yield blogModel_1.default.findOne({ pin: true, _id: idblog });
            if (!checkblog)
                return res.status(400).json({ msg: "Có lỗi sảy ra" });
            yield blogModel_1.default.findOneAndUpdate({ _id: idblog, poster: req.user._id.toString() }, { pin: false });
            return res.status(200).json({ msg: "Đã gỡ ghim bài viết" });
        }
        catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    }),
    getProfile: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            // lấy thông tin user
            const inforuser = yield userModel_1.default.findOne({
                _id: id,
            }).select("-password -post_saved -my_follow -block_account -type -updatedAt -__v");
            // lấy danh sách bài viết đã ghim
            const blogPin = yield blogModel_1.default.find({
                poster: id,
                pin: true,
                is_detroy: false,
            })
                .populate("poster", "name _id story account avatar createdAt")
                .populate("tags", "name _id")
                .select("-content -pin -status -is_detroy -updatedAt -__v");
            // lấy số lượng bài viết đã đăng
            const blogPublishedCount = yield blogModel_1.default.countDocuments({
                poster: id,
            }).exec();
            //
            const commentRecent = yield commentModel_1.default.find({
                user: id,
            })
                .sort({ createdAt: -1 })
                .limit(5)
                .populate("id_blog")
                .exec();
            // lấy số lượng cmt đã viết
            const commentsCount = yield commentModel_1.default.countDocuments({
                user: id,
            }).exec();
            // lấy số lượng tag đã theo dõi
            const tagfollowCount = inforuser === null || inforuser === void 0 ? void 0 : inforuser.my_tags.length;
            // trả về cho người dùng
            return res.status(200).json({
                userinfor: inforuser,
                blogPin,
                blogPublishedCount,
                commentsCount,
                tagfollowCount,
                commentRecent,
            });
        }
        catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    }),
    // danh sách bài viết theo user ( bài k ghim )
    getBlogByUser: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { page, id } = req.params;
            const result = yield blogModel_1.default.find({
                poster: id,
                pin: false,
                is_detroy: false,
                status: "Public"
            })
                .populate("poster", "name _id story account avatar createdAt")
                .populate("tags", "name _id")
                .select("-content -pin -status -is_detroy -updatedAt -__v")
                .sort({ createdAt: -1 })
                .limit(3)
                .skip(3 * (Number(page) - 1));
            return res.status(200).json({ result });
        }
        catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    }),
    getnotification: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.user)
            return res.status(400).json({ msg: "Xác thực thất bại" });
        let filterquery = {};
        try {
            const iduser = req.user._id;
            const type = req.query.type;
            const page = req.query.page;
            // console.log(iduser)
            switch (type) {
                case "all":
                    filterquery = { to_user: iduser };
                    break;
                case "comment":
                    filterquery = { to_user: iduser, type: "comment" };
                    break;
                case "blog":
                    filterquery = { to_user: iduser, type: "blog" };
                    break;
                case "like":
                    filterquery = {
                        $or: [{ type: "like" }, { type: "follow" }],
                        $and: [{
                                to_user: iduser
                            }]
                    };
                    break;
                // case "different":
                //   filterquery = { to_user: iduser, type: "different" };
                //   break;
            }
            const listnoti = yield notifyModel_1.default.find(filterquery)
                .populate("idpost", "_id title poster tags likecount commentcount createdAt ")
                .populate({
                path: "idpost",
                populate: { path: "poster", select: "name _id" },
            })
                .populate({
                path: "idpost",
                populate: { path: "tags", select: "name _id" },
            })
                .populate("from_user", "_id name avatar")
                .sort({ createdAt: -1 });
            res.status(200).json({ listnoti });
        }
        catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    }),
    readingNoti: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _p;
        if (!req.user)
            return res.status(400).json({ msg: "Xác thực thất bại" });
        try {
            yield notifyModel_1.default.updateMany({ to_user: (_p = req.user) === null || _p === void 0 ? void 0 : _p._id }, { is_reading: true });
            return res.status(200).json({ msg: "ok" });
        }
        catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    }),
    getListBlogsaved: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.user)
            return res.status(400).json({ msg: "Xác thực thất bại" });
        try {
            const page = req.params.page;
            const listblogsaved = yield blogModel_1.default.find({ _id: { "$in": req.user.post_saved }, is_detroy: false, status: "Public" })
                .select("_id title poster tags createdAt")
                .limit(15)
                .skip(15 * (Number(page) - 1))
                .populate("poster", "_id name avatar")
                .populate("tags", "_id name");
            const count = yield blogModel_1.default.countDocuments({ _id: { "$in": req.user.post_saved }, is_detroy: false, status: "Public" });
            res.status(200).json({ listblogsaved, count });
        }
        catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    }),
    searchBlogsaved: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.user)
            return res.status(400).json({ msg: "Xác thực thất bại" });
        try {
            const search = req.query.search;
            const resultSearch = yield blogModel_1.default.aggregate([
                {
                    $search: {
                        index: "searchTitleBlog",
                        autocomplete: {
                            query: `${search}`,
                            path: "title",
                        },
                    },
                },
                {
                    $match: {
                        _id: { "$in": req.user.post_saved },
                        status: "Public",
                        is_detroy: false,
                    },
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "poster",
                        foreignField: "_id",
                        as: "poster",
                    },
                },
                { $unwind: "$poster" },
                {
                    $lookup: {
                        from: "tags",
                        localField: "tags",
                        foreignField: "_id",
                        as: "tags",
                    },
                },
                {
                    $project: {
                        _id: 1,
                        title: 1,
                        poster: {
                            _id: 1,
                            name: 1,
                            avatar: 1,
                        },
                        tags: {
                            _id: 1,
                            name: 1,
                        },
                        createdAt: 1,
                    },
                },
            ]);
            res.status(200).json({ resultSearch });
        }
        catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    }),
    getHomeDashbroad: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.user)
            return res.status(400).json({ msg: "Xác thực thất bại" });
        try {
            const page = req.params.page;
            // lấy tổng số bình luận
            const totalComments = yield commentModel_1.default.countDocuments({
                user: req.user._id,
            }).exec();
            // lấy tổng số bài viết đã đăng
            const totalBlog = yield blogModel_1.default.countDocuments({
                poster: req.user._id,
            }).exec();
            // tổng số lượt theo dõi
            const totalFollower = req.user.follower.length;
            // tổng số bạn đang theo dõi
            const listBlog = yield blogModel_1.default.find({ poster: req.user._id, is_detroy: false, status: "Public", pin: false })
                .select("_id title createdAt likecount commentcount viewer saved status")
                .sort({ "createdAt": -1 })
                .limit(10)
                .skip(10 * (Number(page) - 1));
            res.status(200).json({
                totalComments,
                totalBlog,
                totalFollower,
                listBlog
            });
        }
        catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    }),
    getListPinblog: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.user)
            return res.status(400).json({ msg: "Xác thực thất bại" });
        try {
            const listBlog = yield blogModel_1.default.find({ poster: req.user._id, is_detroy: false, status: "Public", pin: true })
                .select("_id title createdAt likecount commentcount viewer saved status")
                .sort({ "createdAt": -1 });
            res.status(200).json({ listBlog });
        }
        catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    }),
    getListBlogPrivate: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.user)
            return res.status(400).json({ msg: "Xác thực thất bại" });
        try {
            const listBlog = yield blogModel_1.default.find({ poster: req.user._id, is_detroy: false, status: "Private", })
                .select("_id title createdAt likecount commentcount viewer saved status")
                .sort({ "createdAt": -1 });
            res.status(200).json({ listBlog });
        }
        catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    }),
    getListFollower: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.user)
            return res.status(400).json({ msg: "Xác thực thất bại" });
        try {
            const listTags = yield userModel_1.default.find({ _id: { "$in": req.user.follower } })
                .select("_id avatar name");
            res.status(200).json({ listTags });
        }
        catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    }),
    getListUserMyFollow: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.user)
            return res.status(400).json({ msg: "Xác thực thất bại" });
        try {
            const listUser = yield userModel_1.default.find({ _id: { "$in": req.user.my_follow } })
                .select("_id avatar name");
            res.status(200).json({ listUser });
        }
        catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    }),
    getTagFollow: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.user)
            return res.status(400).json({ msg: "Xác thực thất bại" });
        try {
            const listtagfollow = req.user.my_tags.map((tag) => tag.idtag);
            const listTags = yield tagsModel_1.default.find({ _id: { "$in": listtagfollow } })
                .select("_id name description total_blog");
            res.status(200).json({ listTags });
        }
        catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    }),
    reportUser: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.user)
            return res.status(400).json({ msg: "Xác thực thất bại" });
        try {
            const { message, user_report } = req.body;
            const newReport = new reportModel_1.default({
                message,
                user_report,
                from_user: req.user._id,
                type: "user"
            });
            const checkReport = yield reportModel_1.default.findOne({ user_report, from_user: req.user._id, type: "user" });
            if (checkReport) {
                return res.status(400).json({ msg: "Bạn đã báo cáo người dùng này trước đó, vui lòng chờ xử lý" });
            }
            yield newReport.save();
            res.status(200).json({ msg: "Gửi yêu cầu báo cáo tài khoản thành công, vui lòng chờ xử lý" });
        }
        catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    }),
    reportBlog: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.user)
            return res.status(400).json({ msg: "Xác thực thất bại" });
        try {
            const { message, blog_report } = req.body;
            const newReport = new reportModel_1.default({
                message,
                blog_report,
                from_user: req.user._id,
                type: "blog"
            });
            const checkReport = yield reportModel_1.default.findOne({ blog_report, from_user: req.user._id, type: "blog" });
            if (checkReport) {
                return res.status(400).json({ msg: "Bạn đã báo cáo Blog này trước đó, vui lòng chờ xử lý" });
            }
            yield newReport.save();
            res.status(200).json({ msg: "Gửi yêu cầu báo cáo Blog thành công, vui lòng chờ xử lý" });
        }
        catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    }),
    getCountNotifiUnRead: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.user)
            return res.status(400).json({ msg: "Xác thực thất bại" });
        try {
            const countNoti = yield notifyModel_1.default.countDocuments({ is_reading: false, to_user: req.user._id });
            res.status(200).json({ countNoti });
        }
        catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    })
};
exports.default = userController;

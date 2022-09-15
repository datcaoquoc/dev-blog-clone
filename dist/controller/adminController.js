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
const userModel_1 = __importDefault(require("../models/userModel"));
const blogModel_1 = __importDefault(require("../models/blogModel"));
const tagsModel_1 = __importDefault(require("../models/tagsModel"));
const reportModel_1 = __importDefault(require("../models/reportModel"));
const adminController = {
    // tạo tag
    createTags: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.user)
            return res.status(400).json({ msg: "Xác thực thất bại" });
        try {
            const { name, description, moderators, abount, logo } = req.body;
            // kiểm tra tag đã tồn tại hay chưa
            const checktag = yield tagsModel_1.default.findOne({
                name: { $regex: `^${name}$`, $options: "i" },
            });
            // // nếu tồn tại
            if (checktag)
                return res.status(400).json({ msg: "Thẻ Tag đã tồn tại" });
            // // tìm trong db các user được add quản trị tag
            // const checkuser = await Users.find({ _id: { $in: moderators } }, objuser);
            // // kiểm tra xem user có role là quản trị viên hay không
            // for (let i = 0; i < checkuser.length; i++) {
            //   if (checkuser[i].role !== "moderators") {
            //     return res
            //       .status(400)
            //       .json({
            //         msg: `Bạn cần thêm quyền Quản trị viên cho user ${checkuser[i].name} trước`,
            //       });
            //   }
            // }
            const newTag = new tagsModel_1.default({
                name,
                description,
                moderators,
                abount,
            });
            yield newTag.save();
            return res.status(200).json({ msg: "Đã thêm 1 Thẻ Tag mới" });
        }
        catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    }),
    updateTags: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.user)
            return res.status(400).json({ msg: "Xác thực thất bại" });
        try {
            const { id, name, desc, abount, moderators } = req.body;
            // update role
            yield tagsModel_1.default.findOneAndUpdate({ _id: id }, {
                name,
                description: desc,
                abount,
                moderators,
            });
            return res.status(200).json({ msg: "Cập nhật thông tin thành công" });
        }
        catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    }),
    // thêm quản trị
    addmoderators: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.user)
            return res.status(400).json({ msg: "Xác thực thất bại" });
        try {
            const { iduser } = req.body;
            // update role
            const user = yield userModel_1.default.findOneAndUpdate({ _id: iduser }, {
                role: "moderators",
            }, { new: true });
            return res.status(200).json({ user });
        }
        catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    }),
    removedmod: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.user)
            return res.status(400).json({ msg: "Xác thực thất bại" });
        try {
            const { iduser } = req.body;
            // update role
            yield userModel_1.default.findOneAndUpdate({ _id: iduser }, {
                role: "user",
            });
            return res.status(200).json({ msg: "Đã hủy quản trị page" });
        }
        catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    }),
    // loại bỏ quản trị viên khỏi tag
    removeModForTag: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.user)
            return res.status(400).json({ msg: "Xác thực thất bại" });
        try {
            const { idmod, idtags } = req.body;
            const moder = yield tagsModel_1.default.findOne({ _id: idtags }, { _id: 0, description: 0, createdAt: 0, updatedAt: 0, __v: 0 });
            // nếu quản trị viên đã có trong tag
            if (moder.moderators.indexOf(idmod) !== -1) {
                yield tagsModel_1.default.findOneAndUpdate({ _id: idtags }, {
                    $pull: { moderators: idmod },
                });
                return res.status(200).json({ msg: `Đã xóa Quản trị viên khỏi thẻ` });
            }
            else {
                return res.status(400).json({ msg: `Quản trị viên không tồn tại` });
            }
        }
        catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    }),
    lockTag: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.user)
            return res.status(400).json({ msg: "Xác thực thất bại" });
        try {
            const { idtags } = req.body;
            yield tagsModel_1.default.findOneAndUpdate({ _id: idtags }, { is_destroy: true });
            return res.status(200).json({ msg: "Đã khóa thẻ tag" });
        }
        catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    }),
    unlockTag: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.user)
            return res.status(400).json({ msg: "Xác thực thất bại" });
        try {
            const { idtags } = req.body;
            yield tagsModel_1.default.findOneAndUpdate({ _id: idtags }, { is_destroy: false });
            return res.status(200).json({ msg: "Đã mở khóa thẻ tag" });
        }
        catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    }),
    getListtagadmin: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const listtag = yield tagsModel_1.default.find({}).sort({ createdAt: -1 }).populate("moderators", "-password");
            const listmod = yield userModel_1.default.find({ role: "moderators" });
            return res.status(200).json({ listtag, listmod });
        }
        catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    }),
    getHomeDashbroadAdmin: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const tagCount = yield tagsModel_1.default.countDocuments({});
            const blogCount = yield blogModel_1.default.countDocuments({});
            const userCount = yield userModel_1.default.countDocuments({});
            const interactive = yield blogModel_1.default.aggregate([
                {
                    $group: {
                        _id: null,
                        amount: { $sum: { $add: [
                                    '$commentcount', '$likecount', '$saved'
                                ] } },
                    }
                },
                {
                    $project: {
                        amount: 1
                    }
                }
            ]);
            return res.status(200).json({ tagCount, blogCount, userCount, interactive });
        }
        catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    }),
    getListUsermanager: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var searchresult = [];
        try {
            const searchvalue = req.query.searchvalue;
            switch (searchvalue) {
                case "":
                    var searchresult = yield userModel_1.default.aggregate([
                        { $sort: { createdAt: -1 } },
                        { '$match': { 'role': { '$ne': 'admin' } } },
                        {
                            $project: {
                                _id: 1,
                                name: 1,
                                story: 1,
                                location: 1,
                                web_url: 1,
                                learning: 1,
                                work: 1,
                                education: 1,
                                account: 1,
                                role: 1,
                                avatar: 1,
                                is_destroy: 1,
                                createdAt: 1,
                                updatedAt: 1
                            }
                        }
                    ]);
                    break;
                default:
                    var searchresult = yield userModel_1.default.aggregate([
                        {
                            $search: {
                                index: "nameUser",
                                autocomplete: {
                                    query: `${searchvalue}`,
                                    path: "name",
                                },
                            },
                        },
                        { '$match': { 'role': { '$ne': 'admin' } } },
                        {
                            $project: {
                                _id: 1,
                                name: 1,
                                story: 1,
                                location: 1,
                                web_url: 1,
                                learning: 1,
                                work: 1,
                                education: 1,
                                account: 1,
                                role: 1,
                                avatar: 1,
                                is_destroy: 1,
                                createdAt: 1,
                                updatedAt: 1
                            }
                        }
                    ]);
            }
            res.status(200).json({ searchresult });
        }
        catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    }),
    lockUser: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userid = req.body.userid;
            const user = yield userModel_1.default.findOneAndUpdate({ _id: userid }, { is_destroy: true }, { new: true });
            res.status(200).json({ user });
        }
        catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    }),
    unlockUser: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userid = req.body.userid;
            const user = yield userModel_1.default.findOneAndUpdate({ _id: userid }, { is_destroy: false }, { new: true });
            res.status(200).json({ user });
        }
        catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    }),
    getReport: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const reports = yield reportModel_1.default.find({ report_process: false })
                .populate('blog_report', "_id title")
                .populate('user_report', "_id name avatar")
                .populate("from_user", "_id name avatar")
                .sort({ "createdAt": -1 });
            return res.status(200).json({ reports });
        }
        catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    }),
    readReport: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield reportModel_1.default.findOneAndUpdate({ _id: req.body.idreport }, { report_process: true });
            return res.status(200).json({ msg: "ok" });
        }
        catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    }),
    getListmod: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const listmod = yield userModel_1.default.find({ role: "moderators" });
            return res.status(200).json({ listmod });
        }
        catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    }),
    getBlogremoved: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const blogremoved = yield blogModel_1.default.find({ is_detroy: true, removed: { "$exists": true } }).select("_id title imagepost")
                .populate("removed.idmod", "_id name avatar role")
                .populate("poster", "_id name avatar role");
            return res.status(200).json({ blogremoved });
        }
        catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    })
};
exports.default = adminController;

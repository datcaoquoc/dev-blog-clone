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
const commentModel_1 = __importDefault(require("../models/commentModel"));
const notifyModel_1 = __importDefault(require("../models/notifyModel"));
const blogModel_1 = __importDefault(require("../models/blogModel"));
const mongoose_1 = __importDefault(require("mongoose"));
const index_1 = require("../index");
const commentController = {
    createComment: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.user)
            return res.status(400).json({ msg: "invalid Authentication" });
        try {
            const { content, id_blog, id_user_blog } = req.body;
            const newComment = new commentModel_1.default({
                user: req.user._id,
                content,
                id_blog,
                id_user_blog // id chủ blog
            });
            const newNotifi = new notifyModel_1.default({
                message: `đã bình luận về bài viết`,
                idpost: id_blog,
                to_user: id_user_blog,
                from_user: req.user._id,
                type: `comment`,
            });
            // nếu không phải chủ blog bình luận
            if (req.user._id.toString() !== id_user_blog) {
                // kiểm tra đã có thông báo bình luận bài viết này của người này chưa
                const checkNoticomment = yield notifyModel_1.default.findOne({ idpost: id_blog,
                    from_user: req.user._id,
                    type: `comment` });
                // nếu chưa
                if (!checkNoticomment) {
                    yield newNotifi.save(),
                        index_1.io.sockets.in(`${id_user_blog}`).emit('new_noti', { msg: "noti" });
                }
            }
            // const abc = userBlog.follower.map((idfolower: any) => (
            //     {
            //         message : `đã bình luận về bài viết của bạn `,
            //         idpost: id_blog,
            //     }
            // ))
            yield newComment.save();
            yield blogModel_1.default.findOneAndUpdate({ _id: id_blog }, { $inc: { commentcount: 1 } });
            return res.json(newComment);
        }
        catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    }),
    getComments: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        // const { limit, skip } = Pagination(req)
        try {
            const data = yield commentModel_1.default.aggregate([
                {
                    $facet: {
                        totalData: [
                            { $match: {
                                    id_blog: new mongoose_1.default.Types.ObjectId(req.params.id),
                                    comment_root: { $exists: false },
                                    user_reply: { $exists: false }
                                } },
                            {
                                $lookup: {
                                    "from": "users",
                                    "localField": "user",
                                    "foreignField": "_id",
                                    "as": "user"
                                }
                            },
                            { $unwind: "$user" },
                            {
                                $lookup: {
                                    "from": "comments",
                                    "let": { comment_id: "$replyComment" },
                                    "pipeline": [
                                        { $match: { $expr: { $in: ["$_id", "$$comment_id"] } } },
                                        {
                                            $lookup: {
                                                "from": "users",
                                                "localField": "user",
                                                "foreignField": "_id",
                                                "as": "user"
                                            }
                                        },
                                        { $unwind: "$user" },
                                        {
                                            $lookup: {
                                                "from": "users",
                                                "localField": "user_reply",
                                                "foreignField": "_id",
                                                "as": "user_reply"
                                            }
                                        },
                                        { $unwind: "$user_reply" },
                                    ],
                                    "as": "replyComment"
                                }
                            },
                            { $sort: { createdAt: -1 } },
                            //   { $skip: skip },
                            //   { $limit: limit }
                        ],
                        totalCount: [
                            { $match: {
                                    id_blog: new mongoose_1.default.Types.ObjectId(req.params.id),
                                    comment_root: { $exists: false },
                                    user_reply: { $exists: false }
                                } },
                            { $count: 'count' }
                        ]
                    }
                },
                {
                    $project: {
                        count: { $arrayElemAt: ["$totalCount.count", 0] },
                        totalData: 1
                    }
                }
            ]);
            const comments = data[0].totalData;
            const count = data[0].count;
            return res.json({ comments, count });
        }
        catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    }),
    replyComment: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.user)
            return res.status(400).json({ msg: "invalid Authentication" });
        try {
            const { content, id_blog, id_user_blog, comment_root, user_reply } = req.body;
            const newComment = new commentModel_1.default({
                user: req.user._id,
                content,
                id_blog,
                id_user_blog,
                comment_root,
                user_reply: user_reply._id
            });
            console.log({ newComment });
            yield commentModel_1.default.findOneAndUpdate({ _id: comment_root }, {
                $push: { replyComment: newComment._id }
            });
            yield newComment.save();
            return res.json(newComment);
        }
        catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    }),
    updateComment: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.user)
            return res.status(400).json({ msg: "invalid Authentication." });
        try {
            const { content } = req.body;
            console.log(req.body);
            const comment = yield commentModel_1.default.findOneAndUpdate({
                _id: req.params.id, user: req.user.id
            }, { content });
            if (!comment)
                return res.status(400).json({ msg: "Bình luận không tồn tại hoặc đã bị xóa" });
            return res.json({ msg: "Update Success!" });
        }
        catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    }),
    deleteComment: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.user)
            return res.status(400).json({ msg: "invalid Authentication." });
        try {
            const comment = yield commentModel_1.default.findOneAndDelete({
                _id: req.params.id,
                $or: [
                    { user: req.user._id },
                    { blog_user_id: req.user._id }
                ]
            });
            if (!comment)
                return res.status(400).json({ msg: "Bình luận không tồn tại hoặc đã bị xóa" });
            // check xem comment muốn xóa có phải là comment trả lời không
            if (comment.comment_root) {
                // nếu là comment trả lời của comment khác thì xóa cmt đó
                yield commentModel_1.default.findOneAndUpdate({ _id: comment.comment_root }, {
                    $pull: { replyCM: comment._id }
                });
            }
            else {
                // nếu là comment không phải trả lời thì xóa tất cả các comment trả lời của cmt đó
                yield commentModel_1.default.deleteMany({ _id: { $in: comment.replyComment } });
                yield blogModel_1.default.findOneAndUpdate({ _id: comment.id_blog }, { $inc: { commentcount: -1 } });
            }
            return res.json({ msg: "Delete Success!" });
        }
        catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    })
};
exports.default = commentController;

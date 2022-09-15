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
const commentModel_1 = __importDefault(require("../models/commentModel"));
const tagsModel_1 = __importDefault(require("../models/tagsModel"));
const mongoose_1 = __importDefault(require("mongoose"));
const ObjectId = mongoose_1.default.Types.ObjectId;
const freeController = {
    getListHomePage: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c;
        var datablog = [];
        let filterquery = {};
        try {
            const filter = req.query.filter;
            const page = req.query.page;
            const skip = 2 * (Number(page) - 1);
            switch (filter) {
                case "new":
                    filterquery = { createdAt: -1 };
                    break;
                case "old":
                    filterquery = { createdAt: 1 };
                    break;
                case "top":
                    filterquery = { interactive: -1 };
                    break;
                case "follow":
                    const mytagarray = (_a = req.user) === null || _a === void 0 ? void 0 : _a.my_tags.map((tag) => tag.idtag);
                    var datablog = yield blogModel_1.default.aggregate([
                        { $match: { poster: { $ne: (_b = req.user) === null || _b === void 0 ? void 0 : _b._id } } },
                        {
                            $match: {
                                $and: [
                                    {
                                        $or: [
                                            { tags: { $in: mytagarray } },
                                            { poster: { $in: (_c = req.user) === null || _c === void 0 ? void 0 : _c.my_follow } },
                                        ],
                                    },
                                    { is_detroy: false },
                                    { status: "Public" }
                                ],
                            },
                        },
                        { $sort: { createdAt: -1 } },
                        { $skip: 2 * (Number(page) - 1) },
                        { $limit: 2 },
                        {
                            $lookup: {
                                from: "users",
                                localField: "poster",
                                foreignField: "_id",
                                as: "poster",
                            },
                        },
                        {
                            $unwind: "$poster",
                        },
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
                                content: 1,
                                title: 1,
                                description: 1,
                                imagepost: 1,
                                poster: {
                                    _id: 1,
                                    name: 1,
                                    avatar: 1,
                                    story: 1,
                                    createdAt: 1,
                                },
                                tags: {
                                    _id: 1,
                                    name: 1,
                                },
                                likecount: 1,
                                commentcount: 1,
                                createdAt: 1,
                                viewer: 1,
                            },
                        },
                    ]);
                    break;
            }
            if (filter !== "follow") {
                var datablog = yield blogModel_1.default.aggregate([
                    {
                        $addFields: {
                            interactive: { $sum: ["$likecount", "$commentcount"] },
                        },
                    },
                    {
                        $match: {
                            is_detroy: false,
                            status: "Public"
                        },
                    },
                    { $sort: filterquery },
                    { $skip: 2 * (Number(page) - 1) },
                    { $limit: 2 },
                    {
                        $lookup: {
                            from: "users",
                            localField: "poster",
                            foreignField: "_id",
                            as: "poster",
                        },
                    },
                    {
                        $unwind: "$poster",
                    },
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
                            content: 1,
                            title: 1,
                            description: 1,
                            imagepost: 1,
                            poster: {
                                _id: 1,
                                name: 1,
                                avatar: 1,
                                story: 1,
                                createdAt: 1,
                            },
                            tags: {
                                _id: 1,
                                name: 1,
                            },
                            likecount: 1,
                            commentcount: 1,
                            createdAt: 1,
                            viewer: 1,
                        },
                    },
                ]);
            }
            return res.status(200).json({ datablog });
        }
        catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    }),
    getBlogTallestinTag: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const listBlogtag = yield tagsModel_1.default.aggregate([
                { $sort: { total_blog: -1 } },
                { $limit: 3 },
                {
                    $lookup: {
                        from: "blogs",
                        localField: "_id",
                        foreignField: "tags",
                        as: "productList",
                    },
                },
                { $unwind: "$productList" },
                { $sort: { "productList.createdAt": -1 } },
                {
                    $match: {
                        $and: [
                            { "productList.status": "Public" },
                            { "productList.is_detroy": false },
                        ],
                    },
                },
                {
                    $group: {
                        _id: "$_id",
                        namecategory: { $first: "$name" },
                        listpost: { $push: "$productList" },
                    },
                },
                { $sort: { _id: 1 } },
                {
                    $project: {
                        listpost: {
                            $slice: ["$listpost", 0, 3],
                        },
                        namecategory: 1,
                    },
                },
            ]);
            return res.status(200).json({ listBlogtag });
        }
        catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    }),
    search: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var searchresult = [];
        try {
            const { type, iduser, searchvalue, page } = req.query;
            switch (type) {
                case "blog":
                    var searchresult = yield blogModel_1.default.aggregate([
                        {
                            $search: {
                                index: "searchTitleBlog",
                                autocomplete: {
                                    query: `${searchvalue}`,
                                    path: "title",
                                },
                            },
                        },
                        {
                            $match: {
                                status: "Public",
                                is_detroy: false,
                            },
                        },
                        { $skip: 2 * (Number(page) - 1) },
                        { $limit: 2 },
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
                                    story: 1,
                                    location: 1,
                                    web_url: 1,
                                    learning: 1,
                                    work: 1,
                                    education: 1,
                                    avatar: 1,
                                },
                                tags: {
                                    _id: 1,
                                    name: 1,
                                },
                                createdAt: 1,
                                likecount: 1,
                                commentcount: 1
                            },
                        },
                    ]);
                    break;
                case "comment":
                    var searchresult = yield commentModel_1.default.aggregate([
                        {
                            $search: {
                                index: "contentComment",
                                autocomplete: {
                                    query: `${searchvalue}`,
                                    path: "content",
                                },
                            },
                        },
                        { $skip: 2 * (Number(page) - 1) },
                        { $limit: 2 },
                        {
                            $lookup: {
                                from: "blogs",
                                localField: "id_blog",
                                foreignField: "_id",
                                as: "blog",
                            },
                        },
                        { $unwind: "$blog" },
                        {
                            $lookup: {
                                from: "users",
                                localField: "user",
                                foreignField: "_id",
                                as: "user",
                            },
                        },
                        { $unwind: "$user" },
                        {
                            $project: {
                                _id: 1,
                                content: 1,
                                likecount: 1,
                                user_like: 1,
                                createdAt: 1,
                                user: {
                                    _id: 1,
                                    name: 1,
                                    story: 1,
                                    location: 1,
                                    web_url: 1,
                                    learning: 1,
                                    work: 1,
                                    education: 1,
                                    avatar: 1,
                                },
                                blog: {
                                    _id: 1,
                                    title: 1,
                                },
                            },
                        },
                    ]);
                    break;
                // tìm kiếm user
                case "user":
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
                        {
                            $match: {
                                is_destroy: false,
                            },
                        },
                        { $skip: 2 * (Number(page) - 1) },
                        { $limit: 2 },
                        {
                            $project: {
                                _id: 1,
                                name: 1,
                                story: 1,
                                follower: 1,
                                avatar: 1,
                                createdAt: 1
                            }
                        }
                    ]);
                    break;
                case "myblog":
                    var searchresult = yield blogModel_1.default.aggregate([
                        {
                            $search: {
                                index: "searchTitleBlog",
                                autocomplete: {
                                    query: `${searchvalue}`,
                                    path: "title",
                                },
                            },
                        },
                        {
                            $match: {
                                poster: new mongoose_1.default.Types.ObjectId(`${iduser}`),
                                status: "Public",
                                is_detroy: false,
                            },
                        },
                        { $skip: 2 * (Number(page) - 1) },
                        { $limit: 2 },
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
                                    story: 1,
                                    location: 1,
                                    web_url: 1,
                                    learning: 1,
                                    work: 1,
                                    education: 1,
                                    avatar: 1,
                                },
                                tags: {
                                    _id: 1,
                                    name: 1,
                                },
                                createdAt: 1,
                                likecount: 1,
                                commentcount: 1
                            },
                        },
                    ]);
                    break;
            }
            return res.status(200).json({ searchresult });
        }
        catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    }),
};
exports.default = freeController;

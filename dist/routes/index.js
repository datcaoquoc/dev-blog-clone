"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authRouter_1 = __importDefault(require("./authRouter"));
const userRouter_1 = __importDefault(require("./userRouter"));
const blogRouter_1 = __importDefault(require("./blogRouter"));
const adminRouter_1 = __importDefault(require("./adminRouter"));
const likeRouter_1 = __importDefault(require("./likeRouter"));
const commentRouter_1 = __importDefault(require("./commentRouter"));
const tagsRouter_1 = __importDefault(require("./tagsRouter"));
const freeRouter_1 = __importDefault(require("./freeRouter"));
const routes = {
    authRouter: authRouter_1.default,
    userRouter: userRouter_1.default,
    blogRouter: blogRouter_1.default,
    adminRouter: adminRouter_1.default,
    likeRouter: likeRouter_1.default,
    commentRouter: commentRouter_1.default,
    tagsRouter: tagsRouter_1.default,
    freeRouter: freeRouter_1.default
};
exports.default = routes;

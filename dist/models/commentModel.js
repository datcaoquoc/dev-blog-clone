"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const commentSchema = new mongoose_1.default.Schema({
    user: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'user' },
    id_blog: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'blog' },
    id_user_blog: mongoose_1.default.Schema.Types.ObjectId,
    content: { type: String, required: true },
    replyComment: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'comment' }],
    user_reply: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'user' },
    comment_root: { type: mongoose_1.default.Types.ObjectId, ref: 'comment' }
}, {
    timestamps: true
});
exports.default = mongoose_1.default.model('comment', commentSchema);

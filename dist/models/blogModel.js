"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const blogSchema = new mongoose_1.default.Schema({
    content: {
        type: String,
        required: true,
        maxLength: 20000,
    },
    title: {
        type: String,
        required: true,
        maxLength: 200,
    },
    imagepost: {
        type: String,
        required: true,
        default: ''
    },
    poster: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'user' },
    tags: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'tag' }],
    likecount: {
        type: Number,
        default: 0
    },
    commentcount: {
        type: Number,
        default: 0
    },
    saved: {
        type: Number,
        default: 0
    },
    viewer: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'user' }],
    pin: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['Public', 'Private'],
        default: 'Public'
    },
    is_detroy: {
        type: Boolean,
        default: false
    },
    removed: {
        idmod: {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'user'
        },
        message: {
            type: String
        }
    }
}, {
    timestamps: true
});
blogSchema.index({ poster: 1 });
exports.default = mongoose_1.default.model('blog', blogSchema);

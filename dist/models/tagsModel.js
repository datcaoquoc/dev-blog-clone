"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const tagSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, "Vui lòng nhập Tag name"],
        trim: true,
        maxlength: [20, "Tag name không vượt quá 20 ký tự"]
    },
    description: {
        type: String,
        trim: true,
        maxlength: [1000, "Mô tả không vượt quá 1000 ký tự"],
        default: ""
    },
    abount: {
        type: String,
        trim: true,
        maxlength: [1000, "không vượt quá 300 ký tự"],
        default: ""
    },
    moderators: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'user' },
    total_blog: {
        type: Number,
        default: 0
    },
    is_destroy: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});
exports.default = mongoose_1.default.model('tag', tagSchema);

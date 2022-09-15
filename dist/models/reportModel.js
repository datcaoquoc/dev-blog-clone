"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const reportSchema = new mongoose_1.default.Schema({
    message: String,
    blog_report: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "blog",
    },
    user_report: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "user",
    },
    from_user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "user",
    },
    report_process: {
        type: Boolean,
        default: false
    },
    type: {
        type: String,
        enum: ['blog', 'user'],
        default: 'user',
    }
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model("report", reportSchema);

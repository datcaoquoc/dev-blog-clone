"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const notificationSchema = new mongoose_1.default.Schema({
    message: String,
    idpost: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "blog",
    },
    to_user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "user",
    },
    from_user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "user",
    },
    type: {
        type: String,
        enum: ['comment', 'like', "different", 'follow', "blog"],
        default: 'different'
    },
    is_reading: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model("notification", notificationSchema);

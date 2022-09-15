"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const likeSchema = new mongoose_1.default.Schema({
    iduser: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'user' },
    idblog: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'ulog' },
}, {
    timestamps: true
});
exports.default = mongoose_1.default.model('like', likeSchema);

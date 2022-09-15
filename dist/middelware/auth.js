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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // lấy token từ req header
        const token = req.header("Authorization");
        // console.log(token)
        // nếu k có trả về msg "Xác thực thất bại" 
        if (!token)
            return res.status(400).json({ msg: "Xác thực thất bại" });
        // decode token
        const decoded = jsonwebtoken_1.default.verify(token, `${process.env.ACCESS_TOKEN_SECRET}`);
        // decode token không đúng báo lỗi "Xác thực thất bại" 
        if (!decoded)
            return res.status(400).json({ msg: "Xác thực thất bại" });
        // tìm kiếm người dùng theo id trong token đã decode được
        const user = yield userModel_1.default.findOne({ _id: decoded.id });
        // nếu không thấy trả về  "Người dùng không tồn tại" 
        if (!user)
            return res.status(400).json({ msg: "Người dùng không tồn tại" });
        // nếu thấy =>  gắn thông tin user vào req và chạy tiếp đến userControler
        req.user = user;
        next();
    }
    catch (error) {
        return res.status(500).json({ msg: error.message });
    }
});
exports.default = auth;

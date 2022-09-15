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
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generatetoken_1 = require("../config/generatetoken");
const sendEmail_1 = __importDefault(require("../config/sendEmail"));
const valid_1 = require("../middelware/valid");
const google_auth_library_1 = require("google-auth-library");
const node_fetch_1 = __importDefault(require("node-fetch"));
const client = new google_auth_library_1.OAuth2Client(`${process.env.MAIL_CLIENT_ID}`);
const CLIENT_URL = `${process.env.BASE_URL}`;
const authController = {
    register: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { name, account, password } = req.body;
            console.log(req.body);
            //tìm kiếm trong db
            const user = yield userModel_1.default.findOne({ account });
            if (user)
                return res.status(400).json({ msg: 'Tài khoản đã tồn tại' });
            // mã hóa mật khẩu
            const hasspassword = yield bcrypt_1.default.hash(password, 12);
            const newUser = { name, account, password: hasspassword };
            // tạo active token bằng tất cả thông tin người dùng nhập name, account, password 
            const active_token = (0, generatetoken_1.generateActiveToken)({ newUser });
            // tạo url xác thực tài khoản
            const url = `${CLIENT_URL}/active/${active_token}`;
            // send email
            if ((0, valid_1.validateEmail)(account)) {
                (0, sendEmail_1.default)(account, url, 'Xác thực tài khoản');
                return res.json({ msg: `Đăng ký thành công. Vui lòng kiểm tra hộp thư được gửi đến địa chỉ Email: ${account}`, url });
            }
        }
        catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    }),
    acctiveAccount: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { active_token } = req.body;
            // decode active token
            const decodetoken = jsonwebtoken_1.default.verify(active_token, `${process.env.ACTIVE_TOKEN_SECRET}`);
            // lấy thông tin user từ activetoken đã decode
            const { newUser } = decodetoken;
            // nếu k có thông tin hoặc token hết hạn thì thông báo cho user
            if (!newUser)
                return res.status(400).json({ msg: "Xác thực không thành công, vui lòng thử lại" });
            // kiểm tra user trong database 
            const user = yield userModel_1.default.findOne({ account: newUser.account });
            // nếu đã tồn tại thì return && thông báo
            if (user)
                return res.status(400).json({ msg: "Tài khoản đã tồn tại" });
            // nếu chưa thì thêm user vào db bằng thông tin user có trong active token
            const new_user = new userModel_1.default(newUser);
            yield new_user.save();
            res.json({ msg: "Xác thực tài khoản thành công !" });
        }
        catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    }),
    login: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { account, password } = req.body;
            // kiểm tra trong db
            const user = yield userModel_1.default.findOne({ account });
            if (!user)
                return res.status(400).json({ msg: 'Tài khoản không tồn tại' });
            // nếu tìm thấy tài khoản khớp với tài khoản người dùng nhập
            loginUser(user, password, res);
        }
        catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    }),
    refreshtoken: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // lấy rf token trong cookie
            const rf_token = req.cookies.refreshtoken;
            // nếu k có thông báo cho người dùng
            if (!rf_token)
                return res.status(400).json({ msg: 'Phiên đăng nhập hết hạn, Vui lòng đăng nhập lại' });
            // nếu có thì decode token ra
            const decode_rftoken = jsonwebtoken_1.default.verify(rf_token, `${process.env.REFRESH_TOKEN_SECRET}`);
            // nếu k có id thì thông báo hết hạn đăng nhâoj 
            if (!decode_rftoken.id)
                return res.status(400).json({ msg: 'Phiên đăng nhập hết hạn, Vui lòng đăng nhập lại' });
            // nếu có thì tiến hành tìm kiếm trong db
            const user = yield userModel_1.default.findById(decode_rftoken.id).select('-password +rf_token');
            // console.log(user)
            // nếu tìm không thấy thì thông báo tài khoản k tồn tại
            if (!user)
                return res.status(400).json({ msg: 'Tài khoản không tồn tại' });
            if (rf_token !== user.rf_token)
                return res.status(400).json({ msg: "Phiên đăng nhập hết hạn, Vui lòng đăng nhập lại" });
            // nếu vượt qua tất cả các bước trên thì dùng id user encode 1 mã token mới gửi về cho người dùng
            const access_token = (0, generatetoken_1.generateAccessToken)({ id: user._id });
            const refresh_token = (0, generatetoken_1.generateRefreshToken)({ id: user._id }, res);
            yield userModel_1.default.findOneAndUpdate({ _id: user._id }, {
                rf_token: refresh_token
            });
            return res.json({ access_token, user });
        }
        catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    }),
    logout: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.user)
            return res.status(400).json({ msg: "Xác thực thất bại" });
        try {
            // xóa rftoken trong cookie
            res.clearCookie('refreshtoken', { path: '/api/refresh_token' });
            yield userModel_1.default.findOneAndUpdate({ _id: req.user._id }, {
                rf_token: ''
            });
            return res.json({ msg: "Đăng xuất" });
        }
        catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    }),
    googleLogin: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id_token } = req.body;
            const veryfi = yield client.verifyIdToken({
                idToken: id_token,
                audience: `${process.env.MAIL_CLIENT_ID}`
            });
            const { email, email_verified, name, picture } = veryfi.getPayload();
            if (!email_verified)
                return res.status(500).json({ msg: 'Xác thực email không thành công, Vui lòng thử lại' });
            const password = email + 'YmxvZ2NoaWFzZWtpZW50aHVj';
            const hasspass = yield bcrypt_1.default.hash(password, 12);
            const user = yield userModel_1.default.findOne({ account: email });
            if (user) {
                loginUser(user, password, res);
            }
            else {
                const infouser = {
                    name,
                    account: email,
                    password: hasspass,
                    avatar: picture,
                    type: 'google'
                };
                registerUser(infouser, res);
            }
        }
        catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    }),
    facebooklogin: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { accessToken, userID } = req.body;
            const URL = `
              https://graph.facebook.com/v3.0/${userID}/?fields=id,name,email,picture&access_token=${accessToken}
            `;
            const data = yield (0, node_fetch_1.default)(URL)
                .then(res => res.json())
                .then(res => { return res; });
            const { email, name, picture } = data;
            const password = email + 'GukjbGIuigUggYUYGhhGgGGHhggI';
            const passwordHash = yield bcrypt_1.default.hash(password, 12);
            const user = yield userModel_1.default.findOne({ account: email });
            if (user) {
                loginUser(user, password, res);
            }
            else {
                const user = {
                    name,
                    account: email,
                    password: passwordHash,
                    avatar: picture.data.url,
                    type: 'facebook'
                };
                registerUser(user, res);
            }
        }
        catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    }),
    forgotPassword: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { account } = req.body;
            const user = yield userModel_1.default.findOne({ account });
            if (!user)
                return res.status(400).json({ msg: 'Tài khoản không tồn tại' });
            const access_token = (0, generatetoken_1.generateAccessToken)({ id: user._id });
            const url = `${CLIENT_URL}/resert_password/${access_token}`;
            if ((0, valid_1.validateEmail)(account)) {
                (0, sendEmail_1.default)(account, url, "Forgot password?");
                return res.json({ msg: "Chúng tôi đã gửi thư tới email của bạn, vui lòng check email" });
            }
        }
        catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    }),
};
const loginUser = (user, password, res) => __awaiter(void 0, void 0, void 0, function* () {
    // decode mật khẩu trong tài khoản tìm thấy trong db và so sánh với mật khẩu ng dùng nhập
    const checkpass = yield bcrypt_1.default.compare(password, user.password);
    console.log(user);
    if (!checkpass)
        return res.status(400).json({ msg: 'Tài khoản hoặc mật khẩu không chính xác' });
    if (user.is_destroy === true)
        return res.status(400).json({ msg: 'Tài khoản của bạn đang tạm khóa' });
    // encode accesstoken và refreshtoken 
    const access_token = (0, generatetoken_1.generateAccessToken)({ id: user._id });
    const refresh_token = (0, generatetoken_1.generateRefreshToken)({ id: user._id }, res);
    yield userModel_1.default.findOneAndUpdate({ _id: user._id }, {
        rf_token: refresh_token
    });
    res.json({
        msg: 'Đăng nhập thành công',
        access_token,
        user: Object.assign(Object.assign({}, user._doc), { password: '' })
    });
});
const registerUser = (user, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newUser = new userModel_1.default(user);
    // encode accesstoken và refreshtoken 
    const access_token = (0, generatetoken_1.generateAccessToken)({ id: newUser._id });
    const refresh_token = (0, generatetoken_1.generateRefreshToken)({ id: newUser._id }, res);
    // lưu token vào cookie 
    // res.cookie('refreshtoken', refresh_token, {
    //     httpOnly: true,
    //     path: '/api/refresh_token',
    //     maxAge: 30 * 24 * 60 * 60 * 1000 // 30 ngày
    // })
    newUser.rf_token = refresh_token;
    yield newUser.save();
    res.json({
        msg: 'Đăng nhập thành công',
        access_token,
        user: Object.assign(Object.assign({}, newUser._doc), { password: '' })
    });
});
exports.default = authController;

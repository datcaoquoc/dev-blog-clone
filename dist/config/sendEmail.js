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
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer = require("nodemailer");
const google_auth_library_1 = require("google-auth-library");
const OAUTH_PLAYGROUND = "https://developers.google.com/oauthplayground";
const CLIENT_ID = `${process.env.MAIL_CLIENT_ID}`;
const CLIENT_SECRET = `${process.env.MAIL_CLIENT_SECRET}`;
const REFRESH_TOKEN = `${process.env.MAIL_REFRESH_TOKEN}`;
const SENDER_MAIL = `${process.env.SENDER_EMAIL_ADDRESS}`;
// send mail
const sendEmail = (to, url, txt) => __awaiter(void 0, void 0, void 0, function* () {
    const oAuth2Client = new google_auth_library_1.OAuth2Client(CLIENT_ID, CLIENT_SECRET, OAUTH_PLAYGROUND);
    oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
    try {
        const access_token = yield oAuth2Client.getAccessToken();
        const transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: SENDER_MAIL,
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                access_token,
            },
        });
        const mailOptions = {
            from: SENDER_MAIL,
            to: to,
            subject: txt,
            html: `
              <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
              <h2 style="text-align: center; text-transform: uppercase;color: black;">DevBlog xin ch??o !</h2>
              <p style="text-align: center">Ch??o m???ng b???n ?????n v???i Blog Chia s??? ki???n th???c, n??i chia s??? nh???ng ki???n th???c hay v?? b??? ??ch <br/>
              vui l??ng nh???p v??o n??t b??n d?????i :
              </p>
              <div style="display: flex; align-item: center">
              <a href=${url} style="background: crimson; text-decoration: none; color: white; padding: 10px 20px; margin: 0 auto; display: inline-block;">${txt}</a>
              </div>
          
              <p>Ho???c b???n c?? th??? nh???p v??o link b??n d?????i :</p>
          
              <div>${url}</div>
              </div>
            `,
        };
        const result = yield transport.sendMail(mailOptions);
        return result;
    }
    catch (err) {
        console.log(err);
    }
});
exports.default = sendEmail;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthEmail = void 0;
const nodemailer_1 = require("../config/mails/nodemailer");
class AuthEmail {
    static sendConfirmationEmail = async (user) => {
        const email = await nodemailer_1.transport.sendMail({
            from: "CashTracker <admin@cashtracker.com>",
            to: user.email,
            subject: "CashTracker - Confirm your cuenta",
            html: `
        <p>Hello, ${user.name}. You are created an account in CashTracker</p>
        <p>Go to the link to complete the verification</p>
        <a href="${process.env.FRONTEND_URL}/auth/confirm-account">Confirm my account</a>
        <p>Use this code: <b>${user.token}</b></p>
      `
        });
        console.log("Message sended", email.messageId);
    };
    static sendRecoverPasswordMail = async (user) => {
        const email = await nodemailer_1.transport.sendMail({
            from: "CashTracker <admin@cashtracker.com>",
            to: user.email,
            subject: "CashTracker - Recover password",
            html: `
        <p>Hello, ${user.name}. Have you tried recover your password?</p>
        <p>If you dont want recover your password ignore this email</p>
        <p>If you want recover your password click below</p>
        <a href="${process.env.FRONTEND_URL}/auth/new-password">Recover password</a>
        <p>Use this code: <b>${user.token}</b></p>
      `
        });
        console.log("Message sended", email.messageId);
    };
}
exports.AuthEmail = AuthEmail;
//# sourceMappingURL=AuthEmail.js.map
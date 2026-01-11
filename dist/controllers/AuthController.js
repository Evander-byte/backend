"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const User_1 = __importDefault(require("../models/User"));
const auth_1 = require("../utils/auth");
const token_1 = require("../utils/token");
const AuthEmail_1 = require("../emails/AuthEmail");
const jwt_1 = require("../utils/jwt");
class AuthController {
    static create = async (req, res) => {
        const { email, password } = req.body;
        //Prevent duplicated
        const userExist = await User_1.default.findOne({ where: { email } });
        if (userExist) {
            const error = new Error("The email is already registered");
            res.status(409).json({ message: error.message });
            return;
        }
        try {
            const user = new User_1.default(req.body);
            user.password = await (0, auth_1.hashPassword)(password);
            user.token = (0, token_1.genearteToken)();
            await user.save();
            await AuthEmail_1.AuthEmail.sendConfirmationEmail({
                name: user.name,
                email: user.email,
                token: user.token,
            });
            res.status(200).json("Account created successfully");
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ message: "There was an error" });
        }
    };
    static confirmAccount = async (req, res) => {
        const { token } = req.body;
        const user = await User_1.default.findOne({ where: { token } });
        if (!user) {
            const error = new Error("Invalid token");
            res.status(401).json({ message: error.message });
            return;
        }
        user.confirmed = true;
        user.token = null;
        await user.save();
        res.status(201).json("Account confirmed successfully");
    };
    static login = async (req, res) => {
        const { email, password } = req.body;
        const user = await User_1.default.findOne({ where: { email } });
        //Checking user exist
        if (!user) {
            const error = new Error("Invalid user");
            res.status(409).json({ message: error.message });
            return;
        }
        //Checking confirmed account
        if (!user.confirmed) {
            const error = new Error("Account no confirmed. Pleas confirm your account");
            res.status(403).json({ message: error.message });
            return;
        }
        //Checking password
        const checkedPassword = await (0, auth_1.checkPassword)(password, user.password);
        if (!checkedPassword) {
            const error = new Error("Invalid password");
            res.status(401).json({ message: error.message });
            return;
        }
        const token = (0, jwt_1.generateJWT)(user.id);
        res.status(200).json({ access_token: token });
    };
    static recoverPassword = async (req, res) => {
        const { email } = req.body;
        const user = await User_1.default.findOne({ where: { email } });
        if (!user) {
            const error = new Error("Invalid user");
            res.status(404).json({ message: error.message });
            return;
        }
        user.token = (0, token_1.genearteToken)();
        await user.save();
        await AuthEmail_1.AuthEmail.sendRecoverPasswordMail({
            name: user.name,
            email: user.email,
            token: user.token,
        });
        res.json("Check your email and fallow the instructions");
    };
    static valdiateToken = async (req, res) => {
        const { token } = req.body;
        const tokenExists = await User_1.default.findOne({ where: { token } });
        if (!tokenExists) {
            const error = new Error("Invalid token");
            res.status(404).json({ message: error.message });
        }
        res.json("Valid token, create a new password");
    };
    static resetPasswordWithToken = async (req, res) => {
        const { token } = req.params;
        const { password } = req.body;
        const user = await User_1.default.findOne({ where: { token } });
        if (!user) {
            const error = new Error("Invalid token");
            res.status(404).json({ message: error.message });
            return;
        }
        //Hash new password
        user.password = await (0, auth_1.hashPassword)(password);
        user.token = null;
        await user.save();
        res.json("Reset password successfully");
    };
    static getAuthUser = async (req, res) => {
        res.json(req.user);
    };
    static updateCurrentPassword = async (req, res) => {
        const { current_password, password } = req.body;
        const { id } = req.user;
        const user = await User_1.default.findByPk(id);
        const checkedPassword = await (0, auth_1.checkPassword)(current_password, user.password);
        if (!checkedPassword) {
            const error = new Error("Invalid password");
            res.status(401).json({ message: error.message });
            return;
        }
        const new_password = await (0, auth_1.hashPassword)(password);
        user.password = new_password;
        await user.save();
        res.json("Changed password successfully");
    };
    static checkPassword = async (req, res) => {
        const { password } = req.body;
        const { id } = req.user;
        const user = await User_1.default.findByPk(id);
        const checkedPassword = await (0, auth_1.checkPassword)(password, user.password);
        if (!checkedPassword) {
            const error = new Error("Invalid password");
            res.status(401).json({ message: error.message });
            return;
        }
        res.json("Correct Password");
    };
    static changeUsernameOrEmail = async (req, res) => {
        const { name, email } = req.body;
        const { id } = req.user;
        try {
            const user = await User_1.default.findByPk(id);
            const emailUnique = await User_1.default.findOne({ where: { email } });
            if (emailUnique) {
                res.status(409).json({ message: "The email is already registered" });
                return;
            }
            if (!user) {
                res.status(404).json({ message: "user not found" });
                return;
            }
            //Update the fileds if provided
            if (email) {
                user.email = email;
            }
            if (user) {
                user.name = name;
            }
            await user.save();
            let message = "Update successful: ";
            const updates = [];
            if (email)
                updates.push("email");
            if (name)
                updates.push("user name");
            message += updates.join(" and ") + " changed successfully";
            res.json(message);
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ message: "There was and error" });
        }
    };
}
exports.AuthController = AuthController;
//# sourceMappingURL=AuthController.js.map
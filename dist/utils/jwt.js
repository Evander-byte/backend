"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodedJWT = exports.generateJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const generateJWT = (id) => {
    const token = jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d"
    });
    return token;
};
exports.generateJWT = generateJWT;
const decodedJWT = (token) => {
    const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    return decoded;
};
exports.decodedJWT = decodedJWT;
//# sourceMappingURL=jwt.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jwt_1 = require("../utils/jwt");
const User_1 = __importDefault(require("../models/User"));
const authenticate = async (req, res, next) => {
    const bearer = req.headers.authorization;
    if (!bearer) {
        const error = new Error("Invalid session");
        res.status(401).json({ error: error.message });
        return;
    }
    const [, token] = bearer.split(" ");
    if (!token) {
        const error = new Error("Invalid token");
        res.status(401).json({ error: error.message });
    }
    try {
        const decoded = (0, jwt_1.decodedJWT)(token);
        if (typeof decoded === "object" && decoded.id) {
            req.user = await User_1.default.findByPk(decoded.id, {
                attributes: ["id", "name", "email"],
            });
            next();
        }
    }
    catch (error) {
        res.status(500).json({ error: "Invalid token" });
    }
};
exports.authenticate = authenticate;
//# sourceMappingURL=auth.js.map
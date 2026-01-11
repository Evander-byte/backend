"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.limiter = void 0;
const express_rate_limit_1 = require("express-rate-limit");
exports.limiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 1000 * 60,
    limit: 5,
    message: { "error": "You've reached the limit of request" }
});
//# sourceMappingURL=rate-limit.js.map
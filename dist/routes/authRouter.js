"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthController_1 = require("../controllers/AuthController");
const express_validator_1 = require("express-validator");
const validation_1 = require("../middleware/validation");
const rate_limit_1 = require("../config/limiter/rate-limit");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.use(rate_limit_1.limiter);
router.post("/create-account", (0, express_validator_1.body)("name").notEmpty().withMessage("Your name cannot be empty"), (0, express_validator_1.body)("email").notEmpty().isEmail().withMessage("Invalid email"), (0, express_validator_1.body)("password")
    .isLength({ min: 8, max: 16 })
    .withMessage("The password is too short, it must have at least eight characters"), validation_1.handleInputErrors, AuthController_1.AuthController.create);
router.post("/confirm-account", (0, express_validator_1.body)("token")
    .isLength({ min: 6, max: 6 })
    .notEmpty()
    .withMessage("Invalid Token"), validation_1.handleInputErrors, AuthController_1.AuthController.confirmAccount);
router.post("/login", (0, express_validator_1.body)("email")
    .notEmpty()
    .withMessage("Invalid email")
    .notEmpty()
    .withMessage("Email cannot be empty"), (0, express_validator_1.body)("password").notEmpty().withMessage("Password cannot be empty"), validation_1.handleInputErrors, AuthController_1.AuthController.login);
router.post("/forgot-password", (0, express_validator_1.body)("email")
    .isEmail()
    .withMessage("Invalid email")
    .notEmpty()
    .withMessage("Email cannot be empty"), validation_1.handleInputErrors, AuthController_1.AuthController.recoverPassword);
router.post("/validate-token", (0, express_validator_1.body)("token")
    .isLength({ min: 6, max: 6 })
    .notEmpty()
    .withMessage("Invalid token"), validation_1.handleInputErrors, AuthController_1.AuthController.valdiateToken);
router.post("/new-password/:token", (0, express_validator_1.param)("token")
    .isLength({ min: 6, max: 6 })
    .notEmpty()
    .withMessage("Invalid token"), (0, express_validator_1.body)("password")
    .isLength({ min: 8, max: 16 })
    .withMessage("The password is too short, it must have at least eight characters"), validation_1.handleInputErrors, AuthController_1.AuthController.resetPasswordWithToken);
router.get("/user", auth_1.authenticate, AuthController_1.AuthController.getAuthUser);
router.post("/update-password", auth_1.authenticate, (0, express_validator_1.body)("current_password")
    .notEmpty()
    .withMessage("The current password cannot be empty"), (0, express_validator_1.body)("password")
    .isLength({ min: 8, max: 16 })
    .withMessage("The new password is too short, it must have at least eight characters")
    .notEmpty()
    .withMessage("The new password is cannot be empty"), validation_1.handleInputErrors, AuthController_1.AuthController.updateCurrentPassword);
router.post("/check-password", auth_1.authenticate, (0, express_validator_1.body)("password")
    .notEmpty()
    .withMessage("The password is required for this action"), validation_1.handleInputErrors, AuthController_1.AuthController.checkPassword);
router.put("/user", auth_1.authenticate, AuthController_1.AuthController.changeUsernameOrEmail);
exports.default = router;
//# sourceMappingURL=authRouter.js.map
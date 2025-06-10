import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";
import { limiter } from "../config/limiter/rate-limit";
import { NotEmpty } from "sequelize-typescript";
import { authenticate } from "../middleware/auth";


const router = Router()
router.use(limiter)

router.post("/create-account", 
  body("name")
    .notEmpty().withMessage("Your name cannot be empty"),
  body("email")
    .notEmpty().isEmail().withMessage("Invalid email"),
  body("password")
    .isLength({min: 8, max: 16}).withMessage("The password is too short, it must have at least eight characters"),
  handleInputErrors,
  AuthController.create)

router.post("/confirm-account",
   body("token")
    .isLength({min: 6, max: 6})
    .notEmpty().withMessage("Invalid Token"),
  handleInputErrors,
  AuthController.confirmAccount)

router.post("/login",
  body("email")
    .notEmpty().withMessage("Invalid email")
    .notEmpty().withMessage("Email cannot be empty"),
  body("password")
    .notEmpty().withMessage("Password cannot be empty"),
  handleInputErrors,
  AuthController.login)

router.post("/recover-password", 
  body("email")
    .isEmail().withMessage("Invalid email")
    .notEmpty().withMessage("Email cannot be empty"),
  handleInputErrors,
  AuthController.recoverPassword)

router.post("/validate-token", 
  body("token")
    .isLength({min: 6, max: 6})
    .notEmpty().withMessage("Invalid token"),
  handleInputErrors,
  AuthController.valdiateToken)

router.post("/new-password/:token", 
  param("token")
    .isLength({min: 6, max: 6})
    .notEmpty().withMessage("Invalid token"),
  body("password")
    .isLength({min: 8, max: 16}).withMessage("The password is too short, it must have at least eight characters"),
  handleInputErrors,
  AuthController.resetPasswordWithToken)

router.get("/user",
  authenticate, 
  AuthController.getAuthUser)

export default router
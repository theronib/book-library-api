import express from "express"
import * as authController from "../controllers/authController"
import { validate } from "../middleware/validate";
import { LoginUserSchema, RegisterUserSchema, RequestPasswordResetSchema, ResetPasswordSchema } from "../schemas/auth.schema";

const router = express.Router();
router.post("/register", validate(RegisterUserSchema), authController.registerUser);
router.post("/login", validate(LoginUserSchema), authController.loginUser);

router.post("/request-password-reset", validate(RequestPasswordResetSchema), authController.requestPasswordReset);
router.post("/reset-password", validate(ResetPasswordSchema), authController.resetPassword);


export default router;
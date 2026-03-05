import express from "express"
import * as authController from "../controllers/authController"
import { validate } from "../middleware/validate";
import { LoginUserSchema, RegisterUserSchema } from "../schemas/auth.schema";

const router = express.Router();
router.post("/register", validate(RegisterUserSchema), authController.registerUser);
router.post("/login", validate(LoginUserSchema), authController.loginUser);

export default router;
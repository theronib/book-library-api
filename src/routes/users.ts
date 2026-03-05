import express from "express"
import * as userController from "../controllers/userController"
import { validate } from "../middleware/validate";
import { auth } from "../middleware/auth.middleware";
import { role } from "../middleware/role.middleware";

const router = express.Router();

router.get("/", auth, role(["ADMIN"]), userController.getUsers);
router.get("/me", auth, role(["ADMIN", "USER"]), userController.getUserByJWT);
router.get("/:id", auth, role(["ADMIN"]), userController.getUserById);

export default router;
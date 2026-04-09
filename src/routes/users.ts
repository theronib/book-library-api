import express from "express"
import * as userController from "../controllers/userController"
import { validate } from "../middleware/validate";
import { auth } from "../middleware/auth.middleware";
import { role } from "../middleware/role.middleware";
import { upload } from "../middleware/upload";

const router = express.Router();

router.get("/", auth, role(["ADMIN"]), userController.getUsers);
router.get("/me", auth, role(["ADMIN", "USER"]), userController.getUserByJWT);

router.post("/me/avatar", auth, role(["ADMIN", "USER"]), upload.single("avatar"), userController.uploadAvatar);
router.delete("/me/avatar", auth, role(["ADMIN", "USER"]), userController.deleteAvatar);

router.get("/:id", auth, role(["ADMIN"]), userController.getUserById);



export default router;
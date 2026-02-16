import express from "express"
import * as userController from "../controllers/userController"
import { validate } from "../middleware/validate";
import { CreateUserSchema } from "../schemas/user.schema";


const router = express.Router();

router.get("/", userController.getUsers);
router.get("/:id", userController.getUserById);
router.post("/", validate(CreateUserSchema), userController.createUser);

export default router;
import express from "express"
import * as bookController from "../controllers/bookController"
import { validate } from "../middleware/validate";
import { CreateBookSchema, ReplaceBookSchema } from "../schemas/book.schema";
import { auth } from "../middleware/auth.middleware";
import { role } from "../middleware/role.middleware";


const router = express.Router();

router.get("/", bookController.getBooks);
router.get("/:id", bookController.getBookById);
router.post("/", auth, role(["ADMIN"]), validate(CreateBookSchema), bookController.createBook);
router.put("/:id", auth, role(["ADMIN"]), validate(ReplaceBookSchema), bookController.replaceBook);
router.delete("/:id", auth, role(["ADMIN"]), bookController.deleteBook);

export default router;
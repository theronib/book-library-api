import express from "express"
import * as bookController from "../controllers/bookController"
import { validate } from "../middleware/validate";
import { CreateBookSchema, ReplaceBookSchema } from "../schemas/book.schema";
import { auth } from "../middleware/auth.middleware";
import { role } from "../middleware/role.middleware";


const router = express.Router();

router.get("/", bookController.getBooks);
router.get("/:id", bookController.getBookById);
router.post("/", validate(CreateBookSchema), auth, role(["ADMIN"]), bookController.createBook);
router.put("/:id", validate(ReplaceBookSchema), auth, role(["ADMIN"]), bookController.replaceBook);
router.delete("/:id", auth, role(["ADMIN"]), bookController.deleteBook);

export default router;
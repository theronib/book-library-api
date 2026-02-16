import express from "express"
import * as bookController from "../controllers/bookController"
import { validate } from "../middleware/validate";
import { CreateBookSchema, ReplaceBookSchema } from "../schemas/book.schema";


const router = express.Router();

router.get("/", bookController.getBooks);
router.get("/:id", bookController.getBookById);
router.post("/", validate(CreateBookSchema), bookController.createBook);
router.put("/:id", validate(ReplaceBookSchema), bookController.replaceBook);
router.delete("/:id", bookController.deleteBook);

export default router;
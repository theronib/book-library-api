import express from "express"
import * as loanController from "../controllers/loanController"
import { validate } from "../middleware/validate";
import { CreateLoanSchema } from "../schemas/loan.schema";

const router = express.Router();

router.get("/", loanController.getLoans);
router.post("/", validate(CreateLoanSchema), loanController.giveLoanToUser);
router.post("/:id/return", loanController.returnLoan);

export default router;
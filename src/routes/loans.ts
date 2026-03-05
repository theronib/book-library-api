import express from "express"
import * as loanController from "../controllers/loanController"
import { validate } from "../middleware/validate";
import { CreateLoanSchema } from "../schemas/loan.schema";
import { auth } from "../middleware/auth.middleware";
import { role } from "../middleware/role.middleware";

const router = express.Router();

router.get("/", auth, role(["ADMIN", "USER"]), loanController.getLoans); // СВОЇ ПОЗИКИ
router.post("/", auth, role(["ADMIN", "USER"]), validate(CreateLoanSchema), loanController.giveLoanToUser);
router.post("/:id/return", auth, loanController.returnLoan);

export default router;
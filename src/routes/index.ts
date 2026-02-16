import express from "express";
import userRoutes from "./users";
import bookRoutes from "./books";
import loanRoutes from "./loans";

const router = express.Router();

router.use("/users", userRoutes);
router.use("/books", bookRoutes)
router.use("/loans", loanRoutes);

export default router;
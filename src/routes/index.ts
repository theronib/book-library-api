import express from "express";
import userRoutes from "./users";
import bookRoutes from "./books";
import loanRoutes from "./loans";
import authRoutes from "./auth";

const router = express.Router();

router.use("/users", userRoutes);
router.use("/books", bookRoutes)
router.use("/loans", loanRoutes);
router.use("/auth", authRoutes)

export default router;
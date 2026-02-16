import * as z from "zod";
import { LoanStatus } from "../types/loan";

export const CreateLoanSchema = z.object({
    userId: z.string()
        .min(1, "User ID is required"),

    bookId: z.string()
        .min(1, "Book ID is required"),
});

export type CreateLoanDto = z.infer<typeof CreateLoanSchema>;

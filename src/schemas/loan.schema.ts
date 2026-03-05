import * as z from "zod";


export const CreateLoanSchema = z.object({
    bookId: z.string()
        .min(1, "Book ID is required"),
});

export type CreateLoanDto = z.infer<typeof CreateLoanSchema>;

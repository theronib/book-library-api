import * as z from "zod";

export const CreateBookSchema = z.object({
    title: z.string()
        .min(1, "Title is required")
        .max(100, "Title must be less than 100 characters"),

    author: z.string()
        .min(1, "Author is required")
        .max(50, "Author must be less than 50 characters"),

    year: z.number()
        .int("Year must be an integer")
        .min(0, "Year must be a positive number")
        .max(new Date().getFullYear(), "Year cannot be in the future"),

    isbn: z.string()
        .min(10, "ISBN must be at least 10 characters")
        .max(13, "ISBN must be at most 13 characters"),

    available: z.boolean()
});

export const ReplaceBookSchema = z.object({
    title: z.string()
        .min(1, "Title is required")
        .max(100, "Title must be less than 100 characters"),

    author: z.string()
        .min(1, "Author is required")
        .max(50, "Author must be less than 50 characters"),

    year: z.number()
        .int("Year must be an integer")
        .min(0, "Year must be a positive number")
        .max(new Date().getFullYear(), "Year cannot be in the future"),

    isbn: z.string()
        .min(10, "ISBN must be at least 10 characters")
        .max(13, "ISBN must be at most 13 characters"),

    // available: z.boolean()
    // .optional()
    available: z.boolean()
});

export type CreateBookDto = z.infer<typeof CreateBookSchema>;
export type ReplaceBookDto = z.infer<typeof ReplaceBookSchema>;
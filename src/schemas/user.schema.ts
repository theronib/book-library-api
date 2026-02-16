import * as z from "zod";

export const CreateUserSchema = z.object({
    name: z.string()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name must be less than 50 characters"),

    email: z.email("Invalid email address")
    .min(5, "Email must be at least 5 characters")
    .max(100, "Email must be less than 100 characters"),
});

export type CreateUserDto = z.infer<typeof CreateUserSchema>;

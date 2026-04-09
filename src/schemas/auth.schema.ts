import * as z from "zod";

export const RegisterUserSchema = z.object({
    email: z.email(),

    name: z.string()
        .min(3, "Name must be at least 3 characters")
        .max(50, "Name must be less than 50 characters"),

    password: z.string()
        .min(8, "Password should be between 8 to 16 characters.")
        .max(20, "Password should be between 8 to 16 characters."),
});

export const LoginUserSchema = z.object({
    email: z.email("Invalid email address")
        .min(5, "Email must be at least 5 characters")
        .max(100, "Email must be less than 100 characters"),

    password: z.string()
        .min(8, "Password should be between 8 to 16 characters.")
        .max(20, "Password should be between 8 to 16 characters."),
});

export const RequestPasswordResetSchema = z.object({
    email: z.email("Invalid email address")
        .min(5, "Email must be at least 5 characters")
        .max(100, "Email must be less than 100 characters")
});

export const ResetPasswordSchema = z.object({
    password: z.string()
        .min(8, "Password should be between 8 to 16 characters.")
        .max(20, "Password should be between 8 to 16 characters."),

    token: z.string()
});


export type RegisterUserDTO = z.infer<typeof RegisterUserSchema>;
export type LoginUserDTO = z.infer<typeof LoginUserSchema>;
export type RequestPasswordResetDTO = z.infer<typeof RequestPasswordResetSchema>;
export type ResetPasswordDTO = z.infer<typeof ResetPasswordSchema>;
import { LoginUserDTO, RegisterUserDTO, RequestPasswordResetDTO, ResetPasswordDTO } from "../schemas/auth.schema";
import prisma from "../lib/prisma";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";
import { RoleStatus } from "../generated/prisma/enums";
import { StringValue } from "ms";

import type { ResetPasswordPayload } from "../types/auth";

import sendMail from "../utils/sendMail";

import CONFIG from "../config";

export async function RegisterUser(user: RegisterUserDTO) {
    const userEmail = user.email;
    const userName = user.name;
    const userPassword = user.password;

    const existingUser = await prisma.user.findUnique({
        where: {
            email: userEmail
        }
    });

    if (existingUser != null) {
        throw new Error("User already exists")
    }

    const hashPassword = await bcrypt.hash(userPassword, 12);

    const newUser = {
        name: userName,
        email: userEmail,
        passwordHash: hashPassword,
        role: RoleStatus.USER
    }
    await prisma.user.create({
        data: newUser
    });
}

export async function GetUser(userEmail: string) {
    const existingUser = await prisma.user.findUnique({
        where: {
            email: userEmail
        }
    });

    return existingUser
}

export async function LoginUser(user: LoginUserDTO) {
    const userEmail = user.email;
    const userPassword = user.password;

    const existingUser = await prisma.user.findUnique({
        where: {
            email: userEmail
        }
    });

    if (existingUser == null) {
        throw new Error("Email or password is incorrect")
    }

    const isPasswordValid = await bcrypt.compare(userPassword, existingUser.passwordHash);

    if (!isPasswordValid) {
        throw new Error("Email or password is incorrect");
    }

    const token = jwt.sign({
        sub: existingUser.id,
        name: existingUser.name,
        role: existingUser.role
    },

        CONFIG.jwtSecret,
        {
            expiresIn: CONFIG.jwtExpiresIn as StringValue
        });

    return token
}

export async function requestPasswordReset(user: RequestPasswordResetDTO) {
    const userEmail = user.email;

    console.log("userEmail", userEmail);
    const existingUser = await prisma.user.findUnique({
        where: {
            email: userEmail
        }
    });

    console.log(existingUser);

    if (existingUser !== null) {
        const token = jwt.sign({
            email: userEmail
        }, CONFIG.jwtSecret, {
            expiresIn: "10m"
        });

        console.log("Generated token:", token);

        await sendMail({
            to: userEmail,
            subject: "Password Reset Request",
            text: `You requested a password reset. Use the following token to reset your password: ${token}`,
            html: `<p>You requested a password reset. Use the following token to reset your password: ${token}</p>`
        })
    }

}

export async function resetPassword(reset: ResetPasswordDTO) {
    const { password, token } = reset;

    try {
        const decoded = jwt.verify(token, CONFIG.jwtSecret) as ResetPasswordPayload;
        const userEmail = decoded.email;
        const existingUser = await prisma.user.findUnique({
            where: {
                email: userEmail
            }
        });

        if (!existingUser) {
            throw new Error("Invalid token");
        }

        await prisma.user.update({
            where: {
                id: existingUser?.id
            },
            data: {
                passwordHash: await bcrypt.hash(password, 12)
            }
        })

    }
    catch (error) {
        throw error;
    }
}
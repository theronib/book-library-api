import { LoginUserDTO, RegisterUserDTO } from "../schemas/auth.schema";
import prisma from "../lib/prisma";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";
import { RoleStatus } from "../generated/prisma/enums";
import {StringValue} from "ms";

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
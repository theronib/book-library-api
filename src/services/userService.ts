import { file, uuid } from "zod";
import prisma from "../lib/prisma";
import fs from "fs/promises";
import path from "path";

// ОТРИМАТИ СПИСОК КОРИСТУВАЧІВ
export async function getUsers() {
    const users = await prisma.user.findMany();

    const userSafeInfo = users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatar ? getFileURL(user.avatar) : null
    }))

    return userSafeInfo
}

// ОТРИМАТИ КОРИСТУВАЧА ЗА ID
export async function getUserById(id: string) {
    const user = await prisma.user.findUnique({
        where: {
            id: id
        }
    });

    if (!user) {
        return null;
    }


    const userSafeInfo = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatar ? getFileURL(user.avatar) : null
    }

    return userSafeInfo;
}

// ПОТОЧНИЙ КОРИСТУВАЧ (З JWT)
export async function getUserMe(id: string) {
    const user = await prisma.user.findUnique({
        where: {
            id: id
        }
    })

    if (!user) {
        return null;
    }

    const userSafeInfo = {
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatar ? getFileURL(user.avatar) : null
    }

    return userSafeInfo;
}

// ЗАВАНТАЖИТИ АВАТАР
export async function uploadAvatar(id: string, file: Express.Multer.File | undefined) {
    const filename = file?.filename;



    const user = await prisma.user.findUnique({
        where: {
            id: id
        }
    })

    if (!user) {
        return null;
    }

    if (user.avatar){
        const oldFilePath = path.resolve("src", "uploads", "avatars", user.avatar);
        await fs.unlink(oldFilePath).catch(() => {
        });
    }

    await prisma.user.update({
        where: {
            id: id
        },
        data: {
            avatar: filename || null
        }
    });
}

// ВИДАЛИТИ АВАТАР
export async function deleteAvatar(id: string) {
    const user = await prisma.user.findUnique({
        where: {
            id: id
        }
    });

    if (!user) {
        return null;
    }

    if (!user.avatar) {
        throw new Error("User does not have an avatar to delete");
    }

    const filePath = path.resolve("src", "uploads", "avatars", user.avatar);
    await fs.unlink(filePath).catch(() => {
    });

    await prisma.user.update({
        where: {
            id: id
        },
        data: {
            avatar: null
        }
    });
}


export function getFileURL(filename: string) {
    const fileURL = `/uploads/avatars/${filename}`;
    return fileURL;
}
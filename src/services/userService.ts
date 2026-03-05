import prisma from "../lib/prisma";


// ОТРИМАТИ СПИСОК КОРИСТУВАЧІВ
export async function getUsers() {
    const users = await prisma.user.findMany();

    const userSafeInfo = users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
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
        role: user.role
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
        role: user.role
    }

    return userSafeInfo;
}

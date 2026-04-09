import { RequestWithUser } from "../middleware/auth.middleware";
import { getUsers as getUsersService } from "../services/userService"
import { getUserById as getUserByIdService } from "../services/userService";
import { getUserMe as getUserMeService } from "../services/userService";
import { uploadAvatar as uploadAvatarService } from "../services/userService";
import { deleteAvatar as deleteAvatarService } from "../services/userService";

import { Request, Response } from "express"

// ОТРИМАТИ СПИСОК ВСІХ КОРИСТУВАЧІВ
export async function getUsers(req: Request, res: Response) {
    const users = await getUsersService();

    res.json({
        users: users
    });
}

// ОТРИМАТИ КОРИСТУВАЧА ЗА ID
export async function getUserById(req: Request, res: Response) {
    const id = String(req.params.id);
    const user = await getUserByIdService(id);

    if (user) {
        return res.json({
            data: user
        });
    }
    else {
        return res.status(404).json({
            error: "User not found"
        })
    }
}

// ОТРИМАТИ КОРИСТУВАЧА (З JWT)
export async function getUserByJWT(req: Request, res: Response) {
    const user = (req as RequestWithUser).user;
    const userInfo = await getUserMeService(user.id);

    if (userInfo) {
        return res.json({
            data: userInfo
        });
    }
    else {
        return res.status(404).json({
            error: "User not found"
        })
    }
}

// ЗАВАНТАЖИТИ АВАТАР
export async function uploadAvatar(req: Request, res: Response) {
    try {
        const user = (req as RequestWithUser).user;
        const userId = user.id;
        const file = req.file;
        await uploadAvatarService(userId, file);
        res.json({
            message: "Avatar uploaded successfully",
            avatarURL: `${file?.path}`

        });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({
                error: error.message
            });
        }
    }
}

// ВИДАЛИТИ АВАТАР
export async function deleteAvatar(req: Request, res: Response) {
    try {
        const user = (req as RequestWithUser).user;
        await deleteAvatarService(user.id);
        res.json({
            message: "Avatar deleted successfully"
        });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(404).json({
                error: error.message
            });
        }
    }
}
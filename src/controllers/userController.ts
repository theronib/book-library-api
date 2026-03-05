import { RequestWithUser } from "../middleware/auth.middleware";
import { getUsers as getUsersService } from "../services/userService"
import { getUserById as getUserByIdService } from "../services/userService";
import { getUserMe as getUserMeService } from "../services/userService";

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
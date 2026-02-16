import { getUsers as getUsersService } from "../services/userService"
import { getUserById as getUserByIdService } from "../services/userService";
import { createUser as createUserService } from "../services/userService";
import { Request, Response } from "express"

// ОТРИМАТИ СПИСОК ВСІХ КОРИСТУВАЧІВ
export function getUsers(req: Request, res: Response) {
    const users = getUsersService();

    res.json({
        users: users
    });
}

// ОТРИМАТИ КОРИСТУВАЧА ЗА ID
export function getUserById(req: Request, res: Response) {
    const id = String(req.params.id);
    const user = getUserByIdService(id);

    if(user) {
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

// СТВОРИТИ КОРИСТУВАЧА
export function createUser(req: Request, res: Response){
    const { name, email } = req.body;
    console.log(name, email);

    if(!name || !email){
        return res.status(400).json({
            error: "Name and email are required"
        });
    }

    const userData = {
        name: name,
        email: email
    }

    const newUser = createUserService(userData);

    res.status(201).json({
        user: newUser
    });
}

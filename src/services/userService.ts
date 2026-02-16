import { CreateUserDto } from "../schemas/user.schema";
import { USERS } from "../storage/users";
import { User } from "../types/user";
import { randomUUID } from "crypto";

// ОТРИМАТИ СПИСОК КОРИСТУВАЧІВ
export function getUsers() {
    return USERS;
}

// ОТРИМАТИ КОРИСТУВАЧА ЗА ID
export function getUserById(id: string) {
    return USERS.find(user => user.id === id);
}

// СТВОРИТИ КОРИСТУВАЧА
export function createUser(user: CreateUserDto) {
    const newUser: User = {
        id: randomUUID(),
        name: user.name,
        email: user.email
    }

    USERS.push(newUser);
    return newUser;
}

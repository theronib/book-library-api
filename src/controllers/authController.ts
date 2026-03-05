import { Request, Response } from "express";
import { GetUser, LoginUser, LoginUser as LoginUserService } from "../services/authService";
import { RegisterUser as RegisterUserService } from "../services/authService";

export async function registerUser(req: Request, res: Response) {

    try {
        const { email, name, password } = req.body;

        const userData = {
            email: email,
            name: name,
            password: password
        };

        await RegisterUserService(userData);

        res.json({
            message: "Registration done!",
        })
    }
    catch (error) {
        if (error instanceof Error && error.message === "User already exists") {
            return res.status(409).json({
                error: error.message
            })
        }
        return res.status(500).json({
            error: "Internal server error"
        })
    }

}

export async function loginUser(req: Request, res: Response) {
    try {
        const { email, password } = req.body;

        const userData = {
            email: email,
            password: password
        };

        const token = await LoginUser(userData);
        const user = await GetUser(email);

        return res.json({
            token: token,
            user: {
                id: user?.id,
                email: user?.email,
                name: user?.name,
                role: user?.role
            }
        });
    }
    catch(error) {
        if (error instanceof Error && error.message === "Email or password is incorrect") {
            return res.status(401).json({
                error: error.message
            })
        }
        return res.status(500).json({
            error: "Internal server error"
        })
    }
}
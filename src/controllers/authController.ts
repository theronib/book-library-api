import { Request, Response } from "express";
import { GetUser, LoginUser, LoginUser as LoginUserService } from "../services/authService";
import { RegisterUser as RegisterUserService } from "../services/authService";
import { requestPasswordReset as requestPasswordResetService } from "../services/authService";
import { resetPassword as resetPasswordService } from "../services/authService";

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
    catch (error) {
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

export async function requestPasswordReset(req: Request, res: Response) {
    try {
        const { email } = req.body;
        console.log(email);

        await requestPasswordResetService({
            email: email
        });

        res.json({
            message: "If a user with such email exists, a password reset link will be sent.",
        })

    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({
                error: error.message
            })
        }
    }
}

export async function resetPassword(req: Request, res: Response, next: Function) {
    try {
        const { password, token } = req.body;
        await resetPasswordService({
            password: password,
            token: token
        })

        return res.json({
            message: "Password reset successful!"
        })
    }
    catch (error) {
        if (error instanceof Error) {
            if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
                return res.status(400).json({
                    error: error.message
                })
            }

            return next(error);
        }

        return res.status(500).json({
            error: "Internal server error"
        })
    }
}
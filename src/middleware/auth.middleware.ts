import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import CONFIG from "../config";
import type { JWTPayload } from "../types/jwt"

export interface RequestWithUser extends Request {
    user: {
        id: string,
        name: string,
        role: string
    }
}

export function auth(req: Request, res: Response, next: NextFunction) {
    const { authorization } = req.headers;

    if (authorization === undefined) {
        return res.status(401).json({
            message: "Please provide an authorization token"
        })
    }

    if (authorization.startsWith("Bearer") !== true) {
        return res.status(401).json({
            message: "Please provide correct authorization token"
        })
    }

    const accessToken = authorization.slice(7);
    jwt.verify(accessToken, CONFIG.jwtSecret, (err, decoded) => {
        if (err) {
            if (err.name === "TokenExpiredError")
                return res.status(401).json({
                    message: "Access token is expired"
                })

            if (err.name === "JsonWebTokenError") {
                return res.status(401).json({
                    message: "Access token is not valid"
                })
            }

            return next(err);
        }

        (req as RequestWithUser).user = {
            id: (decoded as JWTPayload).sub ?? "",
            name: (decoded as JWTPayload).name,
            role: (decoded as JWTPayload).role
        };

        next();
    })
}
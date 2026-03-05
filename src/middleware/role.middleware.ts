import type { Request, Response, NextFunction } from "express";
import { RequestWithUser } from "./auth.middleware";

// export function role(requiredRole: string) {
//     return (req: Request, res: Response, next: NextFunction) => {
//         const user = (req as RequestWithUser).user;

//         if (!user) {
//             return res.status(401).json({
//                 message: "Unauthorized"
//             });
//         }

//         console.log("REQUIRED: ", requiredRole)
//         console.log("USER ROLE:", user.role)
//         if (user.role !== requiredRole) {
//             return res.status(403).json({
//                 message: "Forbidden"
//             });
//         }


//         next();
//     }
// }


export function role(requiredRole: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = (req as RequestWithUser).user;

        if (!user) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        console.log("REQUIRED: ", requiredRole);
        console.log("USER ROLE:", user.role);

        if (!requiredRole.includes(user.role)) {
            return res.status(403).json({
                message: "Forbidden"
            });
        }

        next();
    }
}

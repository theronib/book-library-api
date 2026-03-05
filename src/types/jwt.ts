import type {JwtPayload} from "jsonwebtoken"

export interface JWTPayload extends JwtPayload {
    id: string;
    name: string;
    role: string;
}
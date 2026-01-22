import { NextRequest } from "next/server";
import { VerifyToken } from "./JWT";
import { JWTAuthPayload } from  "@/types/jwt/JwtDecodedPayload";

export function AuthPayload(req: NextRequest) : JWTAuthPayload {
    const token = req.headers.get("Authorization")

    if(!token) {
        throw new Error("No Token Provided")
    }

    const decoded : JWTAuthPayload = VerifyToken(token)

    if(!decoded) {
        throw new Error("No Decoded Token Found ")
    }

    return decoded
    
}
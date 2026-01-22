import { JWTAuthPayload } from "@/types/jwt/JwtDecodedPayload"
import jwt from "jsonwebtoken"

const SECRET = process.env.JWT_SECRET


export function SignToken(payload: JWTAuthPayload) : string {
    if(!SECRET) {
        throw new Error("No Token Provided")
    }
    const token : string = jwt.sign(payload, SECRET, { expiresIn: "24h"})
    return token
}

export function VerifyToken(token : string) :  JWTAuthPayload {
    if(!SECRET) {
        throw new Error("No Token Provided")
    }

    const authedToken  = jwt.verify(token, SECRET) as JWTAuthPayload
     
     return authedToken

}
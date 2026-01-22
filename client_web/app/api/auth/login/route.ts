import { NextResponse, NextRequest } from "next/server";
import { User } from "@/lib/models/User";
import { CompareHash } from "@/utils/hashing/Hashing";
import { RequestError } from "@/lib/errors/RequestError";
import { SignToken } from "@/utils/jwt/JWT";
import { MongoConnect } from "@/lib/mongo/MongoConnect";

export async function POST(req: NextRequest, res: NextResponse) {
    try {
        const { email, password } = await req.json();

        await MongoConnect();

        if (!email || !password) {
            return RequestError.BadRequest("Email and password are required.");
        }

        const user = await User.findOne({ email });

        if (!user) {
            return RequestError.Unauthorized("Invalid email or password.");
        }
        const isPasswordValid = await CompareHash({str: user.password, newStr: password});
        
        if (!isPasswordValid) {
            return RequestError.Unauthorized("Invalid email or password.");
        }

        const token = await SignToken({ userId: user._id, email: user.email });

        return NextResponse.json({ token }, { status: 200 });
    } catch (err: unknown) {
        console.log(err);
        return RequestError.ServerError();
    }
}
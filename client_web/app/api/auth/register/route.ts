import { NextRequest, NextResponse } from "next/server";
import { User } from "@/lib/models/User";
import { HashString } from "@/utils/hashing/Hashing";
import { RequestError } from "@/lib/errors/RequestError";
import { SignToken } from "@/utils/jwt/JWT";
import { MongoConnect } from "@/lib/mongo/MongoConnect";

export async function POST(req: NextRequest, res: NextResponse) {
    try {

        const { firstname, surname, email, password } = await req.json()

        await MongoConnect()

        if (!firstname || !surname || !email || !password) {
            return RequestError.BadRequest("All fields are required.");
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return RequestError.Conflict("User with this email already exists.");
        }

        const hashedPassword = await HashString(password)

        const newUser = new User({
            firstname,
            surname,
            email,
            password: hashedPassword
        })

        await newUser.save();

        const token = await SignToken({ userId: newUser._id, email: newUser.email });

        return NextResponse.json({ token }, { status: 201 });
    } catch(err:unknown) {
        console.log(err)
        return RequestError.ServerError()
    }
}
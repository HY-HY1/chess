import mongoose from "mongoose";

export interface JWTAuthPayload {
  email: string;
  userId: mongoose.Types.ObjectId | string;
}

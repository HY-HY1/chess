import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  firstname: string;
  surname: string;
  email: string;
  password: string;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    firstname: {
      type: String,
      required: true,
      trim: true,
    },
    surname: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

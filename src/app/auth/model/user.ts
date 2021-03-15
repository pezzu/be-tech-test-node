import { Schema, model, Document, Model } from "mongoose";
import { IUser } from "../../../interfaces/user";

export interface IUserModel extends IUser, Document {}

const UserSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
});

export const User: Model<IUserModel> = model<IUserModel>(
  "users",
  UserSchema
);

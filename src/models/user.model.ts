import { Schema, Document } from "mongoose";
import { db } from "../connections/mongodb";
import { User } from "../interfaces/user.interface";

export interface UserModel extends User, Document {}

const schema = new Schema(
    {
        name: String,
        email: String,
        password: String
    }
);

export default db.model<UserModel>('user', schema, 'users');
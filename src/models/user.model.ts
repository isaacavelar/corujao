import { Schema, Document } from "mongoose";
import { db } from "../connections/mongodb";
import { User } from "../interfaces/user.interface";
import crypto from "crypto";

export interface UserModel extends User, Document {
    salt: string;
    generateHash(password: string): string;
    validPassword(password: string): boolean;
}

const schema = new Schema(
    {
        name: String,
        email: {
            type: String,
            index: true,
            unique: true
        },
        password: String,
        salt: String,
        logo: Buffer
    }
);

schema.methods.generateHash = function(password) {
    this.salt = crypto.randomBytes(16).toString('hex');
 
    return crypto.pbkdf2Sync(password, this.salt,
        1000, 64, `sha512`).toString(`hex`);
}

schema.methods.validPassword = function (password) {
    const hash = crypto.pbkdf2Sync(password, this.salt,
        1000, 64, `sha512`).toString(`hex`);

    return this.password === hash;
};

schema.pre<UserModel>('save', function(next) {
    const user = this as UserModel;
    if (user.password) {
        user.password = user.generateHash(user.password);
    }
    next();
});


export default db.model<UserModel>('user', schema, 'users');
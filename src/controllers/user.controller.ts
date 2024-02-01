import { Context } from "koa";
import userModel from "../models/user.model";

export class UserController {
    public static async createUser(ctx: Context, next: Function) {
        const newUser = await userModel.create({
            name: 'admin',
            email: 'admin@admin.com',
            password: '123456789'
        });

        ctx.body = newUser;
    }
}
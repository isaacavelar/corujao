import { Context } from "koa";

export class UserController {
    public static async createUser(ctx: Context, next: Function) {
        ctx.body = { message: 'hello world' };
    }
}
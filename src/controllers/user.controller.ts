import { Context } from "koa";
import userModel from "../models/user.model";
import { PayloadCreateUser, User } from "../interfaces/user.interface";
import fs from 'fs/promises';
import { resolve } from 'path';

export class UserController {
    public static async createUser(ctx: Context, next: Function) {
       const { files, body } = ctx.request;

        const userData: PayloadCreateUser = { ...files, ...body };
        

        const userAlreadyExist = await userModel.findOne({
            email:userData.email
        }).lean();

        if (userAlreadyExist) {
            ctx.body = { message: 'Email já cadastrado, por favor faça login!' }
            ctx.status = 409;
            return;
        }

        const filepath = resolve(__dirname, 'test.txt');

        
        const file = await fs.readFile(userData.logo ? userData.logo.filepath: filepath);

        const user: User = {
            name: userData.name,
            email: userData.email,
            password: userData.password,
            logo: file,
            createDate: '03/01/2023 02:39:00'
        }

        try {
            const newUser = await userModel.create(user);
            ctx.body = newUser;
            ctx.status = 201;
        } catch (err) {
            ctx.body = err;
            ctx.status = 500;
        }      
    }
}
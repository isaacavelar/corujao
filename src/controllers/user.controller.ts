import { Context } from "koa";
import userModel from "../models/user.model";
import { PayloadCreateUser, User } from "../interfaces/user.interface";
import fs from 'node:fs/promises';
import { resolve } from 'node:path';
import moment from 'moment';

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

        const filepath = resolve('./src/assets', 'img_user.png');
        
        const file = await fs.readFile(userData.logo ? userData.logo.filepath: filepath);

        const user: User = {
            name: userData.name,
            email: userData.email,
            password: userData.password,
            logo: file,
            createDate: moment().format('DD/MM/YYYY HH:mm:ss')
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

    public static async authenticated(ctx: Context, next: Function) {
        ctx.body = ctx.user;
        ctx.status = 200;
    }
}
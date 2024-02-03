import jwt from 'jsonwebtoken';
import { Context } from 'koa';
import userModel from '../models/user.model';

export class Auth {
    public static async login(ctx: Context, next: Function) {
        const { email, password } = ctx.request.body;

        const user = await userModel.findOne({
            email: email
        });

        if (!user) {
            ctx.body = {
                message: 'Usuário não encontrado, por favor verifique as credenciais!'
            }

            ctx.status = 401;
            return;
        }

        const passwordIsValid = user.validPassword(password);

        if (!passwordIsValid) {
            ctx.body = {
                message: 'Sua senha está incorreta. Confira-a.'
            }

            ctx.status = 401;
            return;
        }

        const secret = process.env.JWT_SECRET as string;
        const refreshSecret = process.env.JWT_REFRESH as string;
        const expiresIn = 60 * 60
        
        const token = jwt.sign({id: user._id.toString()}, secret, { expiresIn: expiresIn });
        const refreshToken = jwt.sign({id: user._id.toString()}, refreshSecret);

        ctx.body = {
            accessToken: token,
            refreshToken: refreshToken,
            expiresIn: expiresIn
        }
    }
}
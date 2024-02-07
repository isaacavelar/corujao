import jwt from 'jsonwebtoken';
import { Context } from 'koa';
import userModel, { UserModel } from '../models/user.model';
import { LoginJwtDecode } from '../interfaces/login.interface';
import { User } from '../interfaces/user.interface';

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

        ctx.user = user;

        ctx.body = {
            accessToken: token,
            refreshToken: refreshToken,
            expiresIn: expiresIn
        }
    }

    public static async autenticateMiddleware (ctx: Context, next: Function) {
        if (!ctx.header.authorization) {
            ctx.body = {
                message: 'Falha na autenticação. Token invalido'
            }

            ctx.status = 401;
            return;
        }

        const token  = ctx.header.authorization;
        const secret = process.env.JWT_SECRET as string;
    
        try {
            const decode: LoginJwtDecode = jwt.verify(token, secret) as any;
            const user = await userModel.findById(decode.id).lean();

            ctx.user = user || {} as UserModel;    
        
            await next();
        } catch (err) { 
            ctx.body = { message: 'Falha na autenticação. Token invalido' }
            ctx.status = 401
            return;
        }
       
    }

    public static async refreshToken(ctx: Context, next: Function) {
        const { refreshToken, userId } = ctx.request.body;

        const refreshSecret = process.env.JWT_REFRESH as string;

        try {
            const decode: LoginJwtDecode = jwt.verify(refreshToken, refreshSecret) as any;
            
            if (decode.id != userId) {
                ctx.body = {
                    message: 'Falha na autenticação. RefreshToken invalido'
                }
    
                ctx.status = 401;
                return;
            }

            const user = await userModel.findById(userId);

            ctx.user = user || {} as UserModel;
            ctx.body = user;
        } catch (err) {
            ctx.body = { message: 'Falha na autenticação. RefreshToken invalido' }
            ctx.status = 401
            return;
        }
       
    }
}
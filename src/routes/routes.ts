import * as Koa from 'koa';
import Router from 'koa-router';
import { UserRouter } from './user.router';
import { Auth } from '../auth/login';



export class Routes {
   static init(server: Koa) {
        const loginRouter = new Router();
        loginRouter.post('/auth/token', Auth.login);
        loginRouter.post('/auth/refresh', Auth.refreshToken)

        const router = new Router({
            prefix: '/api/v1'
        });

        router.use(Auth.autenticateMiddleware)
        UserRouter.routes(router);

        server.use(loginRouter.routes()).use(loginRouter.allowedMethods());
        server.use(router.routes()).use(router.allowedMethods());
   }
}
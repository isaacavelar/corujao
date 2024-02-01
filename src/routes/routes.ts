import * as Koa from 'koa';
import Router from 'koa-router';
import { UserRouter } from './user.router';



export class Routes {
   static init(server: Koa) {
        const router = new Router({
            prefix: '/api/v1'
        });

        UserRouter.routes(router);

        server.use(router.routes()).use(router.allowedMethods());
   }
}
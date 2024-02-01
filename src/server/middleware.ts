import Koa from 'koa';
import koaBody from 'koa-body';

export class Middleware {
    static init(server: Koa) {
        server.use(koaBody());
    }
}
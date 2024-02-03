import Koa from 'koa';
import koaBody from 'koa-body';
import cors from '@koa/cors'
export class Middleware {
    static init(server: Koa) {
        server.use(koaBody({
            multipart: true
        }));
        server.use(cors());
    }
}
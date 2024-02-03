import Koa from 'koa';
import { Routes } from '../routes/routes';
import { Middleware } from './middleware';

const server = new Koa();

const port = process.env.SERVER_PORT;

Middleware.init(server);
Routes.init(server);

server.use(async (ctx, next) => {
    try {
      await next();
    } catch (error) {
      console.error('Erro global não tratado:', error);
      ctx.status = 500;
      ctx.body = 'Erro interno do servidor';
    }
  });


server.listen(port, () => {
    console.log('🔥 HTTP Server running!');
});
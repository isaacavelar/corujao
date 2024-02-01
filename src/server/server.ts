import Koa from 'koa';
import { Routes } from '../routes/routes';
import { Middleware } from './middleware';

const server = new Koa();

const port = process.env.SERVER_PORT;

Middleware.init(server);
Routes.init(server);


server.listen(port, () => {
    console.log('🔥 HTTP Server running!');
});
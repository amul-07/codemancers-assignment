import { Router } from 'express';
import productRouter from './products.js';
import userRouter from './users.js';

const routes = Router();

routes.use('/products', productRouter);
routes.use('/users', userRouter);

export default routes;

import { Router } from 'express';
import productRouter from './products.js';
import userRouter from './users.js';
import cartRouter from './cart.js';

const routes = Router();

routes.use('/products', productRouter);
routes.use('/users', userRouter);
routes.use('/cart', cartRouter);

export default routes;

import { Router } from 'express';
import { getCart, updateCart, checkOut } from '../controllers/cart.js';
import { protect, restrictTo } from '../middlewares/authentication.js';

const cartRouter = Router();

cartRouter.get('/', protect, restrictTo('User'), getCart);
cartRouter.patch('/', protect, restrictTo('User'), updateCart);
cartRouter.post('/checkout', protect, restrictTo('User'), checkOut);
// cartRouter.get('', protect, restrictTo('User', 'User'), getProducts);
// cartRouter.post('/', protect, restrictTo('User'), upload.single('image'), addProducts);
// cartRouter.delete('/:id', protect, restrictTo('User'), removeProduct);

export default cartRouter;

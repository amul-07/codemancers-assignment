import { Router } from 'express';
import { getProducts, getProduct, addProducts, updateProduct, removeProduct } from '../controllers/products.js';
import { protect, restrictTo } from '../middlewares/authentication.js';

const productRouter = Router();

productRouter.get('/:id', protect, restrictTo('Super-Admin', 'Manager'), getProduct);
productRouter.get('', protect, restrictTo('Super-Admin', 'Manager'), getProducts);
productRouter.post('/', protect, restrictTo('Super-Admin'), addProducts);
productRouter.patch('/:id', protect, restrictTo('Super-Admin', 'Manager'), updateProduct);
productRouter.delete('/:id', protect, restrictTo('Super-Admin'), removeProduct);

export default productRouter;

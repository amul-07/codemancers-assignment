import { Router } from 'express';
import { getProducts, getProduct, addProducts, updateProduct, removeProduct } from '../controllers/products.js';
import { protect, restrictTo } from '../middlewares/authentication.js';
import { upload } from '../../utils/multer.js';

const productRouter = Router();

productRouter.get('/:id', protect, restrictTo('Super-Admin', 'User'), getProduct);
productRouter.get('', protect, restrictTo('Super-Admin', 'User'), getProducts);
productRouter.post('/', protect, restrictTo('Super-Admin'), upload.single('image'), addProducts);
productRouter.patch('/:id', protect, restrictTo('Super-Admin'), upload.single('image'), updateProduct);
productRouter.delete('/:id', protect, restrictTo('Super-Admin'), removeProduct);

export default productRouter;

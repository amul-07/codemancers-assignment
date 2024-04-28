import { Router } from 'express';
import { signup, login, forgetPassword, resetPassword, protect, updatePassword, logout, restrictTo } from '../middlewares/authentication.js';
import { updateDetails, getUser, getUsers } from '../controllers/users.js';
import multer from 'multer';

const upload = multer();

const userRouter = Router();

userRouter.post('/signup', upload.single('image'), signup);
userRouter.post('/login', login);
userRouter.get('/logout', logout);
userRouter.get('/:id', protect, restrictTo('Super-Admin', 'User'), getUser);
userRouter.get('', protect, restrictTo('Super-Admin'), getUsers);

userRouter.post('/forgot-password', forgetPassword);
userRouter.patch('/reset-password/:token', resetPassword);
userRouter.patch('/update-password', protect, updatePassword);
userRouter.patch('/update-details', protect, upload.single('image'), updateDetails);

export default userRouter;

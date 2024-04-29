import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import User from '../../models/Users.js';
import AppError from '../../utils/appError.js';
import catchAsync from '../../utils/catchAsync.js';
import crypto from 'crypto';
import { sendEmail } from '../../utils/email.js';

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);

    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        ...(process.env.NODE_ENV === 'production' ? { secure: true } : { secure: false }),
        httpOnly: true
    };

    res.cookie('jwt', token, cookieOptions);

    //Removing password from output
    user.password = undefined;

    console.log(`Hello👋 ${user.email}`);

    res.status(statusCode).json({
        status: 'success',
        token,
        message: `Hello👋 ${user.email}`,
        data: {
            user
        }
    });
};

/**
 * @description It handles the user signup process.
 */

export const signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role,
        image: req?.file?.originalname
    });

    createSendToken(newUser, 201, res);

    // const token = signToken(newUser._id);
    // res.status(201).json({
    //     status: 'success',
    //     token,
    //     data: {
    //         user: {
    //             id: newUser._id,
    //             name: newUser.name,
    //             email: newUser.email,
    //             role: newUser.role,
    //             image: newUser.image
    //         }
    //     }
    // });
});

/**
 * @description It handles the user login process.
 */

export const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    //checking if email and password exists

    if (!email || !password) {
        return next(new AppError('Please provide email and password', 400));
    }

    //checking if user exists and password is correct

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401));
    }

    //sending token to client

    createSendToken(user, 200, res);

    // const token = signToken(user._id);

    // res.status(201).json({
    //     status: 'success',
    //     token
    // });
});

/**
 * @description It handles the user logout process.
 */

export const logout = catchAsync(async (req, res) => {
    const cookieOptions = {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    };

    res.cookie('jwt', '', cookieOptions);

    res.status(200).json({
        status: 'success'
    });
});

/**
 * @description It handles the user authentication process.
 */

export const protect = catchAsync(async (req, res, next) => {
    let token;
    // Getting token and checking if it exists
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return next(new AppError('You are not logged in! Please log in to get access.', 401));
    }

    // Verifying token

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // Check if user still exits or not

    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
        return next(new AppError('The user belonging to this token does no longer exist.', 401));
    }

    //  Check if user changed password after the token was issued

    if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(new AppError('User recently changed password! Please log in again.', 401));
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;

    next();
});

/**
 * @description It handles the user authorization process.
 */

export const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError('You do not have permission to perform this action'), 403);
        }

        next();
    };
};

/**
 * @description It initiate the process of password resetting by sending the reset token to the user.
 */

export const forgetPassword = catchAsync(async (req, res, next) => {
    // Getting user details based on the provided email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new AppError('There is no user with email address.', 404));
    }

    // Generating random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    //Sending to user's email
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;

    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Your password reset token (valid for 10 min)',
            message
        });

        res.status(200).json({
            status: 'success',
            message: 'Token sent to email!'
        });
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });

        return next(new AppError('There was an error sending the email. Try again later!'), 500);
    }
});

/**
 * @description It completes the process of password resetting.
 */

export const resetPassword = catchAsync(async (req, res, next) => {
    // Getting user based on the token
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now() } });

    // If token has'nt expired, and there is a user, set the new password
    if (!user) {
        return next(new AppError('token is invalid or has expired'), 400);
    }
    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    //update changedPasswordAt property for the user

    // login the user, also sending jwt
    createSendToken(user, 200, res);
});

/**
 * @description It updates the password of logged in user.
 */

export const updatePassword = catchAsync(async (req, res, next) => {
    // Getting user from collection
    const user = await User.findById(req.user.id).select('+password');

    // Checking if the posted password is correct
    if (!user.correctPassword(req.body.passwordCurrent, user.password)) {
        return next(new AppError('Your current password is wrong'), 401);
    }
    // Updating Password
    user.password = req.body.passwordNew;
    await user.save();
    // Log user in , also sending JWT
    createSendToken(user, 200, res);
});

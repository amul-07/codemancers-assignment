import User from '../../models/Users.js';
import AppError from '../../utils/appError.js';
import catchAsync from '../../utils/catchAsync.js';

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach((element) => {
        if (allowedFields.includes(element)) newObj[element] = obj[element];
    });
    return newObj;
};

/**
 * @description It updates the details of logged in user.
 */

export const updateDetails = catchAsync(async (req, res, next) => {
    // Send error if user attempts to change password data
    if (req.body.password) {
        return next(new AppError('This route is not for password updates. Use update-password route'), 400);
    }

    // Filtering out unwanted filed names that does'nt need to be updated
    const filteredBody = filterObj({ ...req.body, ...(req?.file?.originalname && { image: req.file.originalname }) }, 'name', 'email', 'image');

    // Updating user document
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, { new: true, runValidators: true });

    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser
        }
    });
});

/**
 * @description This controller fetches all the details of all users.
 */

export const getUsers = async (req, res) => {
    try {
        const users = await User.find();

        res.status(200).json({
            status: 'success',
            results: users.length,
            data: {
                users
            }
        });
    } catch (error) {
        res.status(404).json({
            status: 'failed',
            message: error
        });
    }
};

/**
 * @description This controller fetches teh details of a particular user of some id.
 */

export const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        res.status(200).json({
            status: 'success',
            results: user.length,
            data: {
                user
            }
        });
    } catch (error) {
        res.status(404).json({
            status: 'failed',
            message: error
        });
    }
};

/**
 * @description It updates the address details of logged in user.
 */

export const updateAddress = catchAsync(async (req, res, next) => {
    // Filtering out unwanted filed names that does'nt need to be updated
    const filteredBody = filterObj({ ...req.body }, 'address', 'city', 'state', 'landmark', 'pinCode');

    // Updating user document
    const updatedUser = await User.findByIdAndUpdate(req.user.id, { address: filteredBody }, { new: true, runValidators: true });

    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser
        }
    });
});

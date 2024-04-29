import User from '../../models/Users.js';
import AppError from '../../utils/appError.js';
import catchAsync from '../../utils/catchAsync.js';
import { STATUS, STATUSMESSAGE, MESSAGE } from '../../utils/constants.js';
import { filterObj } from '../../utils/helper.js';

/**
 * @description It updates the details of logged in user.
 */

export const updateDetails = catchAsync(async (req, res, next) => {
    // Send error if user attempts to change password data
    if (req.body.password) {
        return next(new AppError('This route is not for password updates. Use update-password route'), STATUS.BAD_REQUEST);
    }

    // Filtering out unwanted filed names that does'nt need to be updated
    const filteredBody = filterObj({ ...req.body, ...(req?.file?.originalname && { image: req.file.originalname }) }, 'name', 'email', 'image');

    // Updating user document
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, { new: true, runValidators: true });

    res.status(STATUS.OK).json({
        status: STATUSMESSAGE[STATUS.OK],
        message: MESSAGE.UserDetailsUpdated,
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

        res.status(STATUS.OK).json({
            status: STATUSMESSAGE[STATUS.OK],
            message: MESSAGE.UserDetailsFetched,
            results: users.length,
            data: {
                users
            }
        });
    } catch (error) {
        res.status(STATUS.NOT_FOUND).json({
            status: STATUSMESSAGE[STATUS.NOT_FOUND],
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

        res.status(STATUS.OK).json({
            status: STATUSMESSAGE[STATUS.OK],
            message: MESSAGE.UserDetailsFetched,
            results: user.length,
            data: {
                user
            }
        });
    } catch (error) {
        res.status(STATUS.NOT_FOUND).json({
            status: STATUSMESSAGE[STATUS.NOT_FOUND],
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

    res.status(STATUS.OK).json({
        status: STATUSMESSAGE[STATUS.OK],
        message: MESSAGE.UserAddressUpdated,
        data: {
            user: updatedUser
        }
    });
});

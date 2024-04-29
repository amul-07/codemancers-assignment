import Cart from '../../models/Cart.js';
import Product from '../../models/Products.js';
import User from '../../models/Users.js';
import AppError from '../../utils/appError.js';
import catchAsync from '../../utils/catchAsync.js';
import { sendEmail } from '../../utils/email.js';
import { STATUS, STATUSMESSAGE, MESSAGE } from '../../utils/constants.js';

/**
 * @description It updates the contents of the cart of a particular user.
 */

export const updateCart = catchAsync(async (req, res, next) => {
    const { productId, quantity } = req.body;

    //checking the validity of the requested productId
    const product = await Product.findById(productId);
    if (!product) {
        return next(new AppError(MESSAGE.InvalidProductId, STATUS.BAD_REQUEST));
    }

    let cart = await Cart.find({ userId: req.user.id }).lean();

    //user already have some item in his cart
    if (cart[0]) {
        let productIndex = cart[0].products.findIndex((p) => p.productId == productId);

        // product has not been added in the cart yet
        if (productIndex === -1) {
            cart[0].products.push({ productId, quantity });
        }

        // product already exists in the cart, just updating its quantity
        else {
            let product = cart[0].products[productIndex];
            product.quantity += quantity;
            cart[0].products[productIndex] = product;
        }

        await Cart.updateOne({ userId: req.user.id }, { $set: { products: cart[0].products } });
        cart = cart[0].products;
    }

    //user has no active cart, creating new cart for him
    else {
        const newCart = await Cart.create({
            userId: req.user.id,
            products: [{ productId, quantity }]
        });
        cart = newCart.products;
    }

    res.status(STATUS.OK).json({
        status: STATUSMESSAGE[STATUS.OK],
        message: MESSAGE.CartUpdated,
        data: {
            cart
        }
    });
});

/**
 * @description It return the contents of the cart belonging the user.
 */

export const getCart = catchAsync(async (req, res, next) => {
    const cart = await Cart.findOne({ userId: req.user.id });

    //Checking whether the cart is empty
    if (!cart) {
        return next(new AppError(MESSAGE.EmptyCart, STATUS.BAD_REQUEST));
    }

    res.status(STATUS.OK).json({
        status: STATUSMESSAGE[STATUS.OK],
        message: MESSAGE.CartDetailsFetched,
        data: {
            cart
        }
    });
});

/**
 * @description It lets the user checkout his cart.
 */

export const checkOut = catchAsync(async (req, res, next) => {
    // checking whether the cart is empty
    let cart = await Cart.find({ userId: req.user.id }).lean();
    if (!cart[0]) {
        return next(new AppError(MESSAGE.EmptyCart, STATUS.BAD_REQUEST));
    }

    //checking whether the user has added his shipping address

    const user = await User.find({ $and: [{ _id: req.user.id }, { address: { $exists: true } }] }).lean();

    if (!user[0]) {
        return next(new AppError(MESSAGE.ShippingAddressNotFound, STATUS.BAD_REQUEST));
    }

    // Sending user an email about cart checkout details
    const message = `
        Hi, ${user[0].name}.

        You have ordered the following products:
        Sr No.          Product Id              Quantity
        ${cart[0].products.map((item, index) => {
            return `

        (${index + 1}):        ${item.productId}    ${item.quantity}
        `;
        })}
        Your order will be delivered very soon at:
        ${user[0].address.address}, ${user[0].address.city}, ${user[0].address.state}, ${user[0].address.landmark}, ${user[0].address.pinCode}.

        Thanks for shopping with us.
        `;

    await sendEmail({
        email: user[0].email,
        subject: 'Cart Checked out Successfully! ',
        message
    });

    //Clearing the Cart

    cart = await Cart.deleteOne({ userId: req.user.id });

    res.status(STATUS.OK).json({
        status: STATUSMESSAGE[STATUS.OK],
        message: MESSAGE.CartCheckout
    });
});

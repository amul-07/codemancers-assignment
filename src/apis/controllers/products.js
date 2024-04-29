import Product from '../../models/Products.js';
import { STATUS, STATUSMESSAGE, MESSAGE } from '../../utils/constants.js';

/**
 * @description This controller fetches all the products.
 */

export const getProducts = async (req, res) => {
    try {
        const products = await Product.find();

        res.status(STATUS.OK).json({
            status: STATUSMESSAGE[STATUS.OK],
            message: MESSAGE.ProductDetailsFetched,
            results: products.length,
            data: {
                products
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
 * @description This controller fetches a particular product of some id.
 */

export const getProduct = async (req, res) => {
    try {
        const products = await Product.findById(req.params.id);

        res.status(STATUS.OK).json({
            status: STATUSMESSAGE[STATUS.OK],
            message: MESSAGE.ProductDetailsFetched,
            results: products.length,
            data: {
                products
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
 * @description This controller updates a particular product of some id.
 */

export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { ...req.body, ...(req?.file?.originalname && { image: req.file.originalname }) },
            {
                new: true,
                runValidators: true
            }
        );

        res.status(STATUS.OK).json({
            status: STATUSMESSAGE[STATUS.OK],
            message: MESSAGE.ProductDetailsUpdated,
            data: {
                product
            }
        });
    } catch (error) {
        res.status(STATUS.BAD_REQUEST).json({
            status: STATUSMESSAGE[STATUS.BAD_REQUEST],
            message: error
        });
    }
};

/**
 * @description This controller removes a particular product of some id.
 */

export const removeProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);

        res.status(STATUS.OK).json({
            status: STATUSMESSAGE[STATUS.OK],
            message: MESSAGE.ProductRemoved
        });
    } catch (error) {
        res.status(STATUS.BAD_REQUEST).json({
            status: STATUSMESSAGE[STATUS.BAD_REQUEST],
            message: error
        });
    }
};

/**
 * @description This controller create a particular product.
 */

export const addProducts = async (req, res) => {
    try {
        const newProduct = await Product.create({
            title: req?.body?.title,
            description: req?.body?.description,
            price: req?.body?.price,
            inventoryCount: req?.body?.inventoryCount,
            image: req?.file?.originalname
        });

        res.status(STATUS.CREATED).json({
            status: STATUSMESSAGE[STATUS.CREATED],
            message: MESSAGE.ProductAdded,
            data: {
                product: newProduct
            }
        });
    } catch (error) {
        res.status(STATUS.BAD_REQUEST).json({
            status: STATUSMESSAGE[STATUS.BAD_REQUEST],
            message: error
        });
    }
};

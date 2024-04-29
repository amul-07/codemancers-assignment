import Product from '../../models/Products.js';

/**
 * @description This controller fetches all the products.
 */

export const getProducts = async (req, res) => {
    try {
        const products = await Product.find();

        res.status(200).json({
            status: 'success',
            results: products.length,
            data: {
                products
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
 * @description This controller fetches a particular product of some id.
 */

export const getProduct = async (req, res) => {
    try {
        const products = await Product.findById(req.params.id);

        res.status(200).json({
            status: 'success',
            results: products.length,
            data: {
                products
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

        res.status(200).json({
            status: 'success',
            data: {
                product
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
 * @description This controller removes a particular product of some id.
 */

export const removeProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);

        res.status(204).json({
            status: 'success'
        });
    } catch (error) {
        res.status(404).json({
            status: 'failed',
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

        res.status(201).json({
            status: 'success',
            data: {
                product: newProduct
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'failed',
            message: error
        });
    }
};

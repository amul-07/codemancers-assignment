import { Schema, model } from 'mongoose';
import Product from './Products.js';

const cartSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User',
            unique: true
        },
        products: [
            {
                _id: false,
                productId: { type: Schema.Types.ObjectId, required: true, ref: 'Product' },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1
                }
            }
        ],
        // price:{
        //     subtotal:{type: Number},

        // }
        updatedAt: {
            type: Date,
            default: Date.now()
        }
    },
    { versionKey: false, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// cartSchema.virtual('amount').get( async function () {
//     let amount = 0;
//     if (this.products.length) {
//         const productIds = this.products.map((el) => {
//             return el.productId;
//         });

//         const products = await Product.find({ _id: { $in: [...productIds] } }, { price: 1 }).lean();

//         const gstPercentage = 0.18;

//         let subTotal = 0;
//         for (let i = 0; i < this.products.length; i++) {
//             subTotal += this.products[i].quantity * products[i].price;
//         }
//         const gst = subTotal * gstPercentage;
//         const total = subTotal + gst;

//         amount = total;

//         // const amount = {
//         //     subTotal,
//         //     gst,
//         //     total
//         // };
//     }
//     return amount;
//     // return undefined;
// });

const Cart = new model('Cart', cartSchema);

export default Cart;

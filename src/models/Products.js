import { Schema, model } from 'mongoose';

const productSchema = new Schema({
    title: { type: String, required: [true, 'A Product must have a Title'], trim: true },
    description: { type: String, required: [true, 'A Product must have a Description'], trim: true },
    price: { type: Number, required: [true, 'A Product must have a Price'] },
    inventoryCount: { type: Number, default: 0 },
    coverImage: {
        type: String,
        // required: [true, 'A Product must have a Cover Image'],
        trim: true
    },
    images: [String]
});

const Product = new model('Product', productSchema);

export default Product;

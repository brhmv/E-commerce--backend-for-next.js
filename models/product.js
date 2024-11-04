const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    modelName: { type: String, required: true },
    gallery: { type: [String], required: true },
    stock: { type: Number, required: true },
    rating: { type: Number, default: 0.0 },
    likes: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    category: { type: String, required: false, enum: ["Tech", "Clothing", "Cars"], },
    // order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' }
}, {
    timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
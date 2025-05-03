const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,

    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Card', required: true }],

    totalPrice: { type: Number, required: true },
    status: { type: String, required: true }, //pending, processing, shipped, delivered, cancelled

    paymentMethod: { type: String, required: true },

    isPickup: { type: Boolean, required: true },
    shippingAddress: { type: String },
    shippingPrice: { type: Number },

    isArchived: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', orderSchema);
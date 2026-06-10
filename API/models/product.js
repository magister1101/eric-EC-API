const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    type: { type: String, default: 'others' },
    name: { type: String },
    price: { type: Number },
    quantity: { type: Number },   
    file: { type: String },
    description: { type: String },
    isArchived: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Product', productSchema);
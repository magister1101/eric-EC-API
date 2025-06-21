const mongoose = require('mongoose');

const otherProductSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,

    name: { type: String, required: true },
    code: { type: String },
    category: { type: String },

    price: { type: Number },
    quantity: { type: Number },

    file: { type: String },
    description: { type: String },

    isPreorder: { type: Boolean, default: false },

    isArchived: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },

});

module.exports = mongoose.model('OtherProduct', otherProductSchema);
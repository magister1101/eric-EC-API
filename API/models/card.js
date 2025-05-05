const { create } = require('domain');
const mongoose = require('mongoose');

const cardSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,

    expansion: { type: String },
    game: { type: String },

    name: { type: String, required: true },
    code: { type: String, required: true },
    series: { type: String, required: true },
    rarity: { type: String, required: true },

    price: { type: Number },
    quantity: { type: Number },

    isPreorder: { type: Boolean, default: false },
    url: { type: String },

    file: { type: String },
    description: { type: String },

    isArchived: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Card', cardSchema);
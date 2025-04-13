const mongoose = require('mongoose');

const expansionSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,

    game: { type: String },

    name: { type: String, required: true },
    code: { type: String, required: true },

    file: { type: String },

    isArchived: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Expansion', expansionSchema);
const mongoose = require('mongoose');

const expansionSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,

    name: { type: String, required: true },
    code: { type: String, required: true },

    isArchived: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Game', expansionSchema);
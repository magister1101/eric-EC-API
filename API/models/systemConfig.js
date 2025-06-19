const mongoose = require('mongoose');

const systemConfigSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,

    paymentMethodFile: { type: String },


    isArchived: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('SystemConfig', systemConfigSchema);
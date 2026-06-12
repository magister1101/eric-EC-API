const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    middleName: { type: String },

    email: { type: String },
    file: { type: String },

    addresses: [
        {
            label: { type: String }, // e.g. "Home", "Office"
            additionalInformation: { type: String },
            street: { type: String },
            barangay: { type: String },
            city: { type: String },
            province: { type: String },
            postalCode: { type: String },
            country: { type: String, default: 'Philippines' },

            isDefault: { type: Boolean, default: false }
        }
    ],
    cart: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, default: 1 }
    }],

    isAdmin: { type: Boolean, default: false },

    isArchived: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
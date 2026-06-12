const mongoose = require('mongoose');

const PaymentMethod = require('../models/paymentMethod');


const performUpdate = (id, updateFields, res, updateType) => {
    if (updateType === 'paymentMethod') {
        PaymentMethod.findByIdAndUpdate(id, updateFields, { new: true })
            .then((updatedData) => {
                if (!updatedData) {
                    return ({ message: "Data not found" });
                }
                return updatedData;

            })
            .catch((err) => {
                return ({
                    message: "Error in updating Data",
                    error: err
                });
            })
    }
    else {
        console.log("Invalid updateType");
    }
};

exports.getPaymentMethod = async (req, res) => {
    try {
        const { query, accountNumber, isArchived } = req.query;

        const escapeRegex = (value) => {
            return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        };

        let searchCriteria = {};
        const queryConditions = [];

        if (query) {
            const escaped = escapeRegex(query);
            const orConditions = [];

            if (mongoose.Types.ObjectId.isValid(query)) {
                orConditions.push({ _id: query });
            }

            orConditions.push(
                { name: { $regex: escaped, $options: 'i' } },
                { accountNumber: { $regex: escaped, $options: 'i' } },
            )

            queryConditions.push({ $or: orConditions });
        }

        if (isArchived) {
            const isArchivedBool = isArchived === 'true';
            queryConditions.push({ isArchived: isArchivedBool });
        }

        if (queryConditions.length > 0) {
            searchCriteria = { $and: queryConditions };
        }

        const paymentMethod = await PaymentMethod.find(searchCriteria)
            .sort({ createdAt: -1 });

        return res.status(200).json(paymentMethod);


    }
    catch (error) {
        console.error(error.message);
        res.status(500).json('error in getPaymentMethod');
    }
};

exports.createPaymentMethod = async (req, res) => {
    try {
        const id = new mongoose.Types.ObjectId();
        const { name, accountNumber, file, } = req.body;

        const paymentMethod = new PaymentMethod({
            _id: id,
            name,
            accountNumber,
            file,
        });

        const savePaymentMethod = await paymentMethod.save();
        return res.status(201).json(savePaymentMethod);
    }
    catch (error) {
        console.error(error.message);
        res.status(500).json('error in createPaymentMethod');
    }
};

exports.updatePaymentMethod = async (req, res) => {
    try {

        const id = req.params.id;
        const updateFields = req.body;

        const updatePaymentMethod = performUpdate(id, updateFields, res, 'paymentMethod');
        return res.status(200).json(updatePaymentMethod)

    }
    catch (error) {
        console.error(error.message);
        res.status(500).json('error in updatePaymentMethod');
    }
};


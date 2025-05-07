const mongoose = require('mongoose');
const OtherProduct = require('../models/otherProduct');


exports.getOtherProducts = async (req, res) => {
    try {
        const { query, isArchived, isPreorder } = req.query;

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
                { code: { $regex: escaped, $options: 'i' } },

            )

            queryConditions.push({ $or: orConditions });
        }

        if (isArchived) {
            const isArchivedBool = isArchived === 'true';
            queryConditions.push({ isArchived: isArchivedBool });
        }

        if (isPreorder) {
            const isPreorderBool = isPreorder === 'true';
            queryConditions.push({ isPreorder: isPreorderBool });
        }

        if (queryConditions.length > 0) {
            searchCriteria = { $and: queryConditions };
        }

        const otherProducts = await OtherProduct.find(searchCriteria)
            .sort({ createdAt: -1 });

        return res.status(200).json(otherProducts);


    }
    catch (error) {
        console.error(error.message);
        res.status(500).json('error in getOtherProducts');
    }
};

exports.createOtherProducts = async (req, res) => {
    try {
        const otherProductId = new mongoose.Types.ObjectId();
        const { name, code, price, quantity, description, isPreorder, file } = req.body;

        const otherProduct = new OtherProduct({
            _id: otherProductId,
            name,
            code,
            category,
            price,
            quantity,
            isPreorder,
            description,
            file,
        });

        const saveOtherProduct = await otherProduct.save();
        return res.status(201).json(saveOtherProduct);
    }
    catch (error) {
        console.error(error.message);
        res.status(500).json('error in createOtherProducts');
    }
};
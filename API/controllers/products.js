const mongoose = require('mongoose');
const Product = require('../models/product');

exports.getProduct = async (req, res) => {
    try {
        const { query, isArchived } = req.query;

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
                { type: { $regex: escaped, $options: 'i' } },

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

        const products = await Product.find(searchCriteria)
            .sort({ createdAt: -1 });

        return res.status(200).json(products);


    }
    catch (error) {
        console.error(error.message);
        res.status(500).json('error in getProduct');
    }
};

exports.createProduct = async (req, res) => {
    try {
        const productId = new mongoose.Types.ObjectId();

        const product = new Product({
            _id: productId,
            ...req.body
        });

        const saveProduct = await product.save();
        return res.status(201).json(saveProduct);
    }
    catch (error) {
        console.error(error.message);
        res.status(500).json('error in createProduct');
    }
};
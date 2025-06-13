const mongoose = require('mongoose');

const Order = require('../models/order');
const User = require('../models/user');

const performUpdate = (id, updateFields, res) => {

    Order.findByIdAndUpdate(id, updateFields, { new: true })
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
};

exports.getOrders = async (req, res) => {
    try {
        const { query, isArchived, buyer, status } = req.query;


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

            if (mongoose.Types.ObjectId.isValid(query)) {
                orConditions.push({ buyer: query });
            }

            orConditions.push(
                { status: { $regex: escaped, $options: 'i' } },
                { paymentMethod: { $regex: escaped, $options: 'i' } }
            );

            queryConditions.push({ $or: orConditions });
        }


        if (buyer && mongoose.Types.ObjectId.isValid(buyer)) {
            queryConditions.push({ buyer });
        }

        if (typeof isArchived !== 'undefined') {
            queryConditions.push({ isArchived: isArchived === 'true' });
        }

        if (status) {
            const escaped = escapeRegex(status);
            queryConditions.push({ status: { $regex: escaped, $options: 'i' } });
        }
        if (queryConditions.length > 0) {
            searchCriteria = { $and: queryConditions };
        }

        const orders = await Order.find(searchCriteria)
            .sort({ createdAt: -1 })
            .populate('products.product', 'name price rarity series code file')
            .populate('buyer', 'username firstName lastName middleName email');

        return res.status(200).json(orders);
    } catch (error) {
        console.error(error.message);
        res.status(500).json('error in getOrders');
    }
};

exports.myOrders = async (req, res) => {
    try {
        const buyer = req.userData.userId;

        const orders = await Order.find({ buyer })
            .populate('products.product', 'name price rarity series code file')
            .populate('buyer', 'username firstName lastName middleName email');


        return res.status(200).json(orders);
    } catch (error) {
        console.error(error.message);
    }
}


// exports.getOrders = async (req, res) => {
//     try {
//         const orders = await Order.find({ buyer: req.user._id }).populate('products');
//         res.json(orders);
//     } catch (err) {
//         res.status(500).json({ message: 'Server error' });
//     }
// }

exports.createOrder = async (req, res) => {
    try {
        console.log(req.body);
        const orderId = new mongoose.Types.ObjectId();
        const { products, totalPrice, paymentMethod, isPickup, shippingAddress, shippingPrice } = req.body;
        const buyer = req.userData.userId;

        const order = new Order({
            _id: orderId,
            buyer,
            products,
            totalPrice,
            paymentMethod,
            isPickup,
            shippingAddress,
            shippingPrice
        });

        const savedOrder = await order.save();

        const productIds = products.map(p => p.product);

        await User.findByIdAndUpdate(buyer, {
            $pull: {
                cart: {
                    product: { $in: productIds }
                }
            }
        });

        return res.status(201).json(savedOrder);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Error in createOrder' });
    }
};

exports.updateOrder = async (req, res) => {
    try {

        const orderId = req.params.id;
        const updateFields = req.body;

        const updatedOrder = performUpdate(orderId, updateFields, res);
        return res.status(200).json(updatedOrder)

    }
    catch (error) {
        console.error(error.message);
        res.status(500).json('error in updateOrder');
    }
};
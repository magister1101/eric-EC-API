const mongoose = require('mongoose');
const Card = require('../models/card');
const user = require('../models/user');

exports.getCard = async (req, res) => {
    try {
        const { query, isArchived, game } = req.query;

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
                { series: { $regex: escaped, $options: 'i' } },
                { rarity: { $regex: escaped, $options: 'i' } },
            )

            queryConditions.push({ $or: orConditions });
        }

        if (game) {
            const escaped = escapeRegex(game);
            const orConditions = [];

            orConditions.push(
                { game: { $regex: escaped, $options: 'i' } },
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

        const cards = await Card.find(searchCriteria)
            .sort({ createdAt: -1 });

        return res.status(200).json(cards);


    }
    catch (error) {
        console.error(error.message);
        res.status(500).json('error in getCard');
    }
};

exports.createCard = async (req, res) => {
    try {
        const cardId = new mongoose.Types.ObjectId();
        const { expansion, game, name, code, series, rarity, price, quantity, file, description } = req.body;

        const card = new Card({
            _id: cardId,
            expansion,
            game,
            name,
            code,
            series,
            rarity,
            price,
            quantity,
            file,
            description,
        });

        const saveCard = await card.save();
        return res.status(201).json(saveCard);
    }
    catch (error) {
        console.error(error.message);
        res.status(500).json('error in createCard');
    }
}
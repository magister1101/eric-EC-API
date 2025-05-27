const mongoose = require('mongoose');
const Card = require('../models/card');
const { scrapePrice, scrapePriceScraperAPI } = require('../utils/scraperUtils');


const performUpdate = (id, updateFields, res) => {
    Card.findByIdAndUpdate(id, updateFields, { new: true })
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

exports.getCard = async (req, res) => {
    try {
        const { query, isArchived, game, isPreorder } = req.query;

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

        if (isPreorder) {
            const isPreorderBool = isPreorder === 'true';
            queryConditions.push({ isPreorder: isPreorderBool });
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
        const { expansion, game, name, code, series, rarity, price, quantity, file, description, isPreorder, url } = req.body;

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
            isPreorder,
            url,
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
};

exports.updateCard = async (req, res) => {
    try {
        console.log(req.body);
        const cardId = req.params.cardId;
        const updateFields = req.body;

        const updatedCard = performUpdate(cardId, updateFields, res);
        return res.status(200).json(updatedCard)

    }
    catch (error) {
        console.error(error.message);
        res.status(500).json('error in updateCard');
    }
};


exports.scrapePrice = async (req, res) => {
    try {
        const { url } = req.body;

        if (!url) return res.status(400).json({ error: 'URL is required' });

        const { price, stock } = await scrapePrice(url);

        if (price === null) {
            return res.status(500).json({ error: 'Failed to fetch price' });
        }

        const priceConverted = price * 0.5;

        return res.json({ price: priceConverted, stock });
    }
    catch (error) {
        console.error(error.message);
        return res.status(500).json('error in scrapePrice');
    }

};



const mongoose = require('mongoose');

const Expansion = require('../models/expansion');

exports.getExpansion = async (req, res) => {
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

        const expansions = await Expansion.find(searchCriteria)
            .sort({ createdAt: -1 });

        return res.status(200).json(expansions);


    }
    catch (error) {
        console.error(error.message);
        res.status(500).json('error in getExpansion');
    }
};

exports.createExpansion = async (req, res) => {
    try {
        const id = new mongoose.Types.ObjectId();
        const { game, name, code, file, } = req.body;

        const expansin = new Expansion({
            _id: id,
            game,
            name,
            code,
            file,
        });

        const saveExpansion = await expansin.save();
        return res.status(201).json(saveExpansion);
    }
    catch (error) {
        console.error(error.message);
        res.status(500).json('error in createExpansion');
    }
};

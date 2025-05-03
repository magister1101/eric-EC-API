const mongoose = require('mongoose');

const Expansion = require('../models/expansion');
const Rarity = require('../models/rarity');
const Game = require('../models/game');

const performUpdate = (id, updateFields, res, updateType) => {
    if (updateType === 'expansion') {
        Expansion.findByIdAndUpdate(id, updateFields, { new: true })
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
    else if (updateType === 'rarity') {
        Rarity.findByIdAndUpdate(id, updateFields, { new: true })
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
    else if (updateType === 'game') {
        Game.findByIdAndUpdate(id, updateFields, { new: true })
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

        const expansion = new Expansion({
            _id: id,
            game,
            name,
            code,
            file,
        });

        const saveExpansion = await expansion.save();
        return res.status(201).json(saveExpansion);
    }
    catch (error) {
        console.error(error.message);
        res.status(500).json('error in createExpansion');
    }
};

exports.updateExpansion = async (req, res) => {
    try {

        const expansionId = req.params.id;
        const updateFields = req.body;

        const updatedCard = performUpdate(expansionId, updateFields, res, 'expansion');
        return res.status(200).json(updatedCard)

    }
    catch (error) {
        console.error(error.message);
        res.status(500).json('error in updateCard');
    }
};


//rarity

exports.getRarity = async (req, res) => {
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

        const rarities = await Rarity.find(searchCriteria)
            .sort({ createdAt: -1 });

        return res.status(200).json(rarities);


    }
    catch (error) {
        console.error(error.message);
        res.status(500).json('error in getRarity');
    }
};

exports.createRarity = async (req, res) => {
    try {
        const id = new mongoose.Types.ObjectId();
        const { game, name, code, } = req.body;

        const rarity = new Rarity({
            _id: id,
            game,
            name,
            code,
        });

        const saveRarity = await rarity.save();
        return res.status(201).json(saveRarity);
    }
    catch (error) {
        console.error(error.message);
        res.status(500).json('error in createRarity');
    }
};

exports.updateRarity = async (req, res) => {
    try {

        const rarityId = req.params.id;
        const updateFields = req.body;

        const updatedCard = performUpdate(rarityId, updateFields, res, 'rarity');
        return res.status(200).json(updatedCard)

    }
    catch (error) {
        console.error(error.message);
        res.status(500).json('error in updateRarity');
    }
};

//game

exports.getGame = async (req, res) => {
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
                { code: { $regex: escaped, $options: 'i' } },
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

        const games = await Game.find(searchCriteria)
            .sort({ createdAt: -1 });

        return res.status(200).json(games);


    }
    catch (error) {
        console.error(error.message);
        res.status(500).json('error in getGame');
    }
};

exports.createGame = async (req, res) => {
    try {
        const id = new mongoose.Types.ObjectId();
        const { name, code, } = req.body;

        const game = new Game({
            _id: id,
            name,
            code,
        });

        const saveGame = await game.save();
        return res.status(201).json(saveGame);
    }
    catch (error) {
        console.error(error.message);
        res.status(500).json('error in createGame');
    }
};

exports.updateGame = async (req, res) => {
    try {

        const gameId = req.params.id;
        const updateFields = req.body;

        const updatedGame = performUpdate(gameId, updateFields, res, 'game');
        return res.status(200).json(updatedGame)

    }
    catch (error) {
        console.error(error.message);
        res.status(500).json('error in updateGame');
    }
};
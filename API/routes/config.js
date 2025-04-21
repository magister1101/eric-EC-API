const express = require('express');
const router = express.Router();
const authentication = require('../middlewares/authentication.js');

const configController = require('../controllers/config.js');


//GET
//RARITY
router.get('/rarity/get', configController.getRarity)

//EXPANSION
router.get('/expansion/get', configController.getExpansion)


//POST
//RARITY
router.post('/rarity/create', configController.createRarity)
router.post('/rarity/update/:id', configController.updateRarity)

//EXPANSION
router.post('/expansion/create', configController.createExpansion)
router.post('/expansion/update/:id', configController.updateExpansion)


//PUT

//DELETE



module.exports = router;
const express = require('express');
const router = express.Router();
const authentication = require('../middlewares/authentication.js');

const cardsController = require('../controllers/cards.js');

//GET

router.get('/', cardsController.getCard)

//POST

router.post('/create', cardsController.createCard)

//PUT

//DELETE



module.exports = router;
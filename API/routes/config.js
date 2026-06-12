const express = require('express');
const router = express.Router();
const authentication = require('../middlewares/authentication.js');

const configController = require('../controllers/config.js');


//GET
//PAYMENT METHOD
router.get('/paymentMethod/get', configController.getPaymentMethod)


//POST
//PAYMENT METHOD
router.post('/paymentMethod/create', configController.createPaymentMethod)
router.post('/paymentMethod/update/:id', configController.updatePaymentMethod)

//PUT

//DELETE



module.exports = router;
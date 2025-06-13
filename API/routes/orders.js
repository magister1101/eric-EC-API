const express = require('express');
const router = express.Router();
const authentication = require('../middlewares/authentication.js');

const ordersController = require('../controllers/orders.js');

//GET
router.get('/', ordersController.getOrders);
router.get('/myOrders', authentication, ordersController.myOrders);


//POST
router.post('/createOrder', authentication, ordersController.createOrder);
router.post('/updateOrder/:id', authentication, ordersController.updateOrder);


module.exports = router;


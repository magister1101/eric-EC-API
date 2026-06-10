const express = require('express');
const router = express.Router();
const authentication = require('../middlewares/authentication.js');

const productsController = require('../controllers/products.js');

//GET

router.get('/', productsController.getProduct)

//POST

router.post('/create', authentication, productsController.createProduct)
// router.post('/update/:cardId', authentication, productsController.updateProduct)

//PUT

//DELETE



module.exports = router;
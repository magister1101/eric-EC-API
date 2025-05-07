const express = require('express');
const router = express.Router();
const authentication = require('../middlewares/authentication.js');

const otherProductsController = require('../controllers/otherProducts.js');

//GET

router.get('/', otherProductsController.getOtherProducts);

//POST

router.post('/create', otherProductsController.createOtherProducts)

//PUT

//DELETE



module.exports = router;
const express = require('express');
const router = express.Router();
const authentication = require('../middlewares/authentication.js');

const configController = require('../controllers/config.js');


//GET

router.get('/expansion/get', configController.getExpansion)


//POST

router.post('/expansion/create', configController.createExpansion)
router.post('/expansion/update/:id', configController.updateExpansion)


//PUT

//DELETE



module.exports = router;
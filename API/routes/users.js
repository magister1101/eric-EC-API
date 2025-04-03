const express = require('express');
const router = express.Router();
const authentication = require('../middlewares/authentication');

const UsersController = require('../controllers/users.js');

//GET

router.get('/', UsersController.getUser)

//POST

router.post('/create', UsersController.createUser)
router.post('/login', UsersController.loginUser);

//PUT

//DELETE



module.exports = router;
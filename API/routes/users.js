const express = require('express');
const router = express.Router();
const authentication = require('../middlewares/authentication');

const UsersController = require('../controllers/users.js');

//GET

router.get('/', UsersController.getUser)
router.get('/viewer', authentication, UsersController.getViewer)

//POST

router.post('/create', UsersController.createUser)
router.post('/loginUser', UsersController.loginUser);
router.post('/loginAdmin', UsersController.loginAdmin);
router.post('/update/:userId', UsersController.updateUser);

//PUT

//DELETE



module.exports = router;
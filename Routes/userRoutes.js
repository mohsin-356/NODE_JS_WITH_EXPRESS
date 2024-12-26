const authController=require('../Controllers/authController');
const userController=require('../Controllers/userController');

const express = require('express');
const router = express.Router();

router.route("/updatePassword").patch(authController.protect,userController.updatePassword);

module.exports = router;
const authController=require('../Controllers/authController');
const userController=require('../Controllers/userController');

const express = require('express');
const router = express.Router();

router.route("/getAllUsers")
            .get(
                userController.getAllUsers
                );

router.route("/updatePassword")
            .patch(
                authController.protect,
                userController.updatePassword
                );

router.route("/updateMe")
            .patch(
                authController.protect,
                userController.updateMe
            );

router.route("/deleteMe")
            .delete(
                authController.protect,
                userController.deleteMe
            );
            
module.exports = router;
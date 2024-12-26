const { token } = require("morgan");
const User = require("../Models/userModel");
const asyncErrorHandler = require("../Utils/asyncErrorHandler");
const sendMail = require("../Utils/email");
const customError = require("../Utils/customError");
const jwt = require("jsonwebtoken");
const util = require("util");
const crypto = require("crypto");
const jwtSignTokenGenerator =require('../Utils/jwtSignTokenGenerator');
const authController=require('./authController');

exports.updatePassword = asyncErrorHandler(async (req, res, next) => {
    //1-GET THE CURRENT USER FROM DATABASE
    const user = await User.findById(req.user._id).select("+password");
    //2-CHECK IF THE CURRENT SUPPLIED PASSWORD IS CORRECT
    if (!user.matchPassword(req.body.currentPassword, user.password)) {
      return next(new customError("Current password is incorrect", 401));
    }
    //3-IF THE SUPPLIED PASSWORD IS VALID, UPDATE THE USER'S PASSWORD
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.passwordChangedAt = Date.now();
    await user.save();
    //4-LOG THE USER IN
    authController.createTokenResponse(user, 200, res);
  });
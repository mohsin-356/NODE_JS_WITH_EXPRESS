const { token } = require("morgan");
const User = require("../Models/userModel");
const asyncErrorHandler = require("../Utils/asyncErrorHandler");
const sendMail = require("../Utils/email");
const customError = require("../Utils/customError");
const jwt = require("jsonwebtoken");
const util = require("util");
const crypto = require("crypto");
const authController=require('./authController');

const filterRequestObject=(obj,...allowedFields)=>{
  const newObj={};
  console.log("\n");
  console.log(obj);
  console.log("\n");
  Object.keys(obj).forEach(prop=>{
    if(allowedFields.includes(prop))
    {
      newObj[prop]=obj[prop];
    }
  });
  return newObj;
}

exports.getAllUsers = asyncErrorHandler(async (req, res, next) => {
    const users = await User.find();
    res.status(200).json({
        status: 'success',
        length: users.length,
        data: {
            users
        }
    })
});

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

exports.updateMe=asyncErrorHandler(async (req, res, next) => {
  //1-CHECK IF THE USER IS TRYING TO UPDATE THE PASSWORD
  if (req.body.password || req.body.confirmPassword)
  {
    return next(new customError("Please use /updateMyPassword to update the password", 400));  
  }
  //2-UPDATE THE USER DOCUMENT
  const filteredObject=filterRequestObject(req.body,'name','email');
  const updatedUser=await User.findByIdAndUpdate(req.user._id,filteredObject,{new:true,runValidators:true});
  authController.createTokenResponse(updatedUser, 200, res);
});

exports.deleteMe=asyncErrorHandler(async(req,res,next)=>{
  await User.findByIdAndUpdate(req.user._id,{active:false});
  res.status(204).json({
    status:'success',
    data:null,
    message:'User deleted successfully'
  });
});
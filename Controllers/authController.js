const { token } = require('morgan');
const User=require('../Models/userModel');
const asyncErrorHandler = require('../Utils/asyncErrorHandler');
const sendMail = require('../Utils/email');
const customError = require('../Utils/customError');
const jwt=require('jsonwebtoken');
const util=require('util');
const crypto=require('crypto');
const jwtSignTokenGenerator=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES_IN});
}
//Send token to client
// app.post("/api/v1/users/signup",signUp);
//POST => '/api/v1/users/signup'
exports.signUp=asyncErrorHandler(async(req,res,next)=>{
    //OLD-WAY-BUT-100%-CORRECT-WAY
    // const newUser=new User(req.body);
    // const user=await newUser.save();
    // res.status(201).json({
    //     status:'success',
    //     data:{user}
    // });
    
    //NEW-WAY-WITH-PASSWORD-HASHING
    // const {name,email,password}=req.body;
    // const user=await User.create({name,email,password});
    // const user=await User.create(req.body);
    // sendTokenResponse(user,201,res);
    const newUser=await User.create(req.body);
    //creating a logic for json web tokens
    // const token=jwt.sign({id:newUser._id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES_IN});
    const token=jwtSignTokenGenerator(newUser._id);
    // console.log(pm.response.json().token);
    return res.status(201).json({
        status:'success',
        token,
        data:{
            newUser
        },
        message:'User created successfully'
    });
});
// app.post("/api/v1/users/login",login);
//POST => '/api/v1/users/login'
exports.login=asyncErrorHandler(async(req,res,next)=>{
    const email=req.body.email;
    const password=req.body.password;
    //check if email and password exist
    if(!email || !password)
    {
        const error= new customError('Please provide email and password',400);
        return next(error);
    }
    //checks if user exists
    if(email.match(/.+\@.+\..+/) && password.length>=8)
    {
        const user =await User.findOne({email}).select('+password');
        if(!user || !(await user.matchPassword(password,user.password)))
        {
            const error= new customError('Invalid email or password',401);
            return next(error);
        }
        else
        {
            //creating a logic for json web tokens
            // const token=jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES_IN});
            const token=jwtSignTokenGenerator(user._id);
            res.status(200).json({
                status:'success',
                token:token, 
                // user,
                message:'Logged in successfully'
            });
        }
    }
    else{
        const error= new customError('Invalid email or password',401);
        return next(error);
    }
});
exports.protect=asyncErrorHandler(async(req,res,next)=>{
    //1.read the token & check  1if it exists
    const testToken=req.headers.authorization;
    let token;
    if (testToken && testToken.startsWith('Bearer'))
    {
        token=testToken.split(' ')[1];
    }
    if (!token)
    {
        next(new customError('You are not logged in',401));
    }
    //2. verify/validate the token
    const decodedToken= await util.promisify(jwt.verify)(token,process.env.JWT_SECRET);
    console.log(decodedToken);
    //if the user exits, attach it to the request
    const user=await User.findById(decodedToken.id);
    if(!user)
    {
        next(new customError('User no longer exists',401));
    }
    // if the user has changed password, log them out
    if(user.isPasswordChanged(decodedToken.iat))
    {
        const error=new customError('User has changed password. Please log in again.',401);
        next(error);
    }
    req.user=user;
    next();
});
exports.restrict=(role)=>{
    return (req,res,next)=>{
        if(req.user.role!==role)
        {
            next(new customError('You do not have permission to access this route',403));
        }
        next();
    }
}
exports.forgotPassword=asyncErrorHandler(async(req,res,next)=>{
    //1 GET THE USER ON THE POSTed EMAIL
    const user=await User.findOne({email:req.body.email});
    if(!user)
    {
        next(new customError('No user found with this email',404));
    }
    //2 GENERATE a random RESET TOKEN 
    const resetToken=user.createResetPasswordToken();
     await user.save({validateBeforeSave:false});
    // //3 SEND RESET LINK TO THE USER
    const resetURL=`${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
    const message=`You are receiving this email because you have requested a password reset. Please click on the following link to reset your password: \n\n${resetURL}\n\n If you did not make this request, please ignore this email and no changes will be made.`;
    try
    {
        await sendMail({
            email:user.email,
            subject:'Password Reset',
            message:message
        });
        res.status(200).json({
            status:'success',
            message:'Reset password link sent to your email'
        });
    }
    catch (error)
    {
        user.passwordResetToken=undefined;
        user.passwordResetExpires=undefined;
        user.save({validateBeforeSave:false});
        return next(new customError('Error sending email, Please try again! later',500));
    }
});
exports.resetPassword=asyncErrorHandler(async(req,res,next)=>{
    //1IF THE USER EXISTS WITH THE GIVEN TOKEN & TOKEN HAS NOT EXPIRED
    let token=crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user=await User.findOne({passwordResetToken:token,passwordResetTokenExpires:{$gt:Date.now()}});
    if (!user)
    {
        const error=new customError('Invalid or expired token',400);
        next(error);
    }
    //2 RESETTING THE USER's PASSWORD
    user.password=req.body.password;
    user.confirmPassword=req.body.confirmPassword;
    user.passwordResetToken=undefined;
    user.passwordResetTokenExpires=undefined;
    user.passwordChangedAt=Date.now();
    user.save();
    //3 LOG THE USER IN
    token=jwtSignTokenGenerator(user._id);
    res.status(200).json({
        status:'success',
        token:token, 
        // user,
        message:'Logged in successfully'
    });

});
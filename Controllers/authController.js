const { token } = require('morgan');
const User=require('../Models/userModel');
const asyncErrorHandler = require('../Utils/asyncErrorHandler');
const customError = require('../Utils/customError');
const jwt=require('jsonwebtoken');
const util=require('util');
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
yy
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
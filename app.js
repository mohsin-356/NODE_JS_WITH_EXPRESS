const express = require("express"); //returns a function that creates an Express application
const app = express();//calling the function to create an Express application
const rateLimit = require("express-rate-limit");//rate limiting middleware to secure the application from DOS attacks
// const helmet = require("helmet");//security middleware for Express.js to help you secure your applications by setting various HTTP headers
const xss = require("xss-clean");//middleware to prevent XSS attacks
const sanitize = require("express-mongo-sanitize");//middleware to prevent NoSQL injection attacks
const httpParametersPollution = require("hpp");//middleware to prevent HTTP Parameter Pollution attacks
const morgan=require('morgan');//HTTP request logger middleware for node.js
const customError=require('./Utils/customError');
const globalErrorHandler=require('./Controllers/errorController');//error handling [MIDDLEWARE(s)]
const moviesRouter=require('./Routes/moviesRoutes');//[ROUTE(s)] for [MOVIE]-operations
const authRouter=require('./Routes/authRoutes');//[ROUTE(s)] for [AUTHENTICATION]-operations
const userRouter=require('./Routes/userRoutes');//[ROUTE(s)] for [USER]-operations
const { whitelist } = require("validator");

let limiter = rateLimit({
    max: 100, // limit each IP to 100 requests per windowMs
    windowMs: 15 * 60 * 1000, // 15 minutes
    message: "Too many requests from this IP, please try again after 15 minutes",
});

app.use('/api',limiter); // apply to all requests

app.use(morgan('dev'));//[GLOBAL-MIDDLEWARE] to log the HTTP requests to the console
app.use(express.json({limit: '10kb'}));//[GLOBAL-MIDDLEWARE] to parse the incoming request body to JSON format 

app.use(sanitize());//[GLOBAL-MIDDLEWARE] to prevent NoSQL injection attacks
app.use(xss());//[GLOBAL-MIDDLEWARE] to prevent XSS attacks
app.use(httpParametersPollution({
        whitelist:['duration',
                'ratings',
            'releaseYear',]
}));//[GLOBAL-MIDDLEWARE] to secure the application by setting various HTTP headers

app.use("/api/v1/movies", moviesRouter);//we are actually mounting this router on the ['/api/v1/MOVIES]'-route
app.use("/api/v1/auth",authRouter);//we are actually mounting this router on the ['/api/v1/AUTH']-route
app.use("/api/v1/user",userRouter);//we are actually mounting this router on the ['/api/v1/USER']-route
app.all('*',(req,res,next)=>{
    // return res.status(404).json({
    //     status: "error",
    //     message: `Can't find ${req.originalUrl} on this server`,
    // });
    // const err=new Error(`Can't find ${req.originalUrl} on this server`);
    // err.status='fail';
    // err.statusCode=404;
    const err=new customError(`Can't find ${req.originalUrl} on this server`,404);
    next(err);
});

app.use(globalErrorHandler);
module.exports = app;
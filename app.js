const express = require("express"); //returns a function that creates an Express application
const app = express();
const morgan=require('morgan');
const customError=require('./Utils/customError');
const globalErrorHandler=require('./Controllers/errorController');
const moviesRouter=require('./Routes/moviesRoutes');
const authRouter=require('./Routes/authRoutes');
const userRouter=require('./Routes/userRoutes');
app.use(morgan('dev'));
//CREATE A SERVER
app.use(express.json());
app.use("/api/v1/movies", moviesRouter);//we are actually mounting this router on the '/api/v1/movies' route
app.use("/api/v1/auth",authRouter);//we are actually mounting this router on the '/api/v1/movies' route
app.use("/api/v1/user",userRouter);//we are actually mounting this router on the '/api/v1/movies' route
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
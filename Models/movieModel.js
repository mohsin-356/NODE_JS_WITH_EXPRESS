const mongoose = require('mongoose');
const fs=require('fs');
//CREATING A MOVIE SCHEMA
const movieSchema = new mongoose.Schema({
    name:{ 
      type:String,
      unique:true,
      required:[true,'Movie name is required field'],
      trim:true
    },
    description:{
        type:String,
        required:[true,'Movie description is required field'],
        trim:true
    },
    duration:{
      type:Number,
      required:[true,'Movie duration is required field']
    },
    ratings:{
        type:Number,
        required:[true,'Movie rating is required field'],
        default:1.0,
        min:[1, 'Rating must be between 1 and 5'],
        max:[5, 'Rating must be between 1 and 5'],
    },
    totalRating:{
        type:Number
    },
    releaseYear:{
        type:Number,
        required:[true,'Movie release year is required field']
    },
    releaseDate:{
        type:Date
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    genres:{
        type:[String],
        required:[true,'Movie genres are required field']
    },
    directors:{
        type:[String],
        required:[true,'Movie directors are required field']
    },
    coverImage:{
        type:String,
        required:[true,'Movie cover image is required field']
    },
    actors:{
        type:[String],
        required:[true,'Movie actors are required field']
    },
    price:{
        type:Number,
        required:[true,'Movie price is required field']        
    },
    createdBy:{
        type:String
    }
  },{
    toJSON:{virtuals:true},//it gets applied everytime the object is going to displayed in JSON format
    toObject:{virtuals:true}//it gets applied everytime the object is going to displayed in JSON format and for OBJECT
  });
  movieSchema.virtual('durationInHours').get(function(){
    return this.duration/60;
  });
  //HERE ARE SOME MONGOOSE MIDDLEWARES FUNCTIONS
  //this middle-ware function is going to be executed BEFORE saving a document to the database
  movieSchema.pre('save',function(next){
      this.createdBy='MOHSIN';
      next();
    });
  //this middle-ware function is going to be executed AFTER saving a document to the database
  movieSchema.post('save',(doc,next)=>{
    const content=`\n A new movie has been created with the following details: ${JSON.stringify(doc)}\n`;
    fs.writeFileSync('./Log/log.txt',content, {flag: 'a' },(error) => console.error(error));
    next();
  });
  //this middle-ware function is going to be executed BEFORE sending the query
  movieSchema.pre(/^find/,function(next){
    this.find({ releaseYear: { $lte: Date.now() } });  // Filter movies released just before current year
    this.startTime=Date.now();
    next();
  });
  //this middle-ware function is going to be executed AFTER sending the query
  movieSchema.post(/^find/,function(docs,next){
    this.find({ releaseYear: { $lte: Date.now() } });  // Filter movies released just before current year
    this.endTime=Date.now();
    const executionTime=this.endTime-this.startTime;
    //use fs module to write execution time to a log file
    fs.writeFileSync('./Log/log.txt',`\n Execution time for query: ${executionTime} milliseconds \n`, { flag: 'a' },(error) => console.error(error));
    next();
  });
  //this middle-ware function is going to be executed BEFORE AGGREGATING a document from the database
  movieSchema.pre('aggregate',function(next){
    // Filter movies released just before current year
    this.pipeline().unshift({ $match: { releaseYear: { $lte: Date.now() } } }); 
    next();
  });
//this middle-ware function is going to be executed AFTER AGGREGATING a document from the database
//   movieSchema.post('aggregate',function(docs,next){
//     this.pipeline().unshift({ $match: { releaseYear: { $lte: Date.now() } } });  // Filter movies released just   before current year
//     next();
//   });
module.exports = mongoose.model('Movie', movieSchema);
//CREATING MOVIE-MODEL
const Movie = mongoose.model('Movie', movieSchema);
module.exports = Movie;
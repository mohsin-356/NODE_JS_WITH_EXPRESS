// const express = require("express"); //returns a function that creates an Express application
// const app = express();
const { stringify } = require("querystring");
const Movie = require("./../Models/movieModel");
let ApiFeatures = require("../Utils/ApiFeatures");
// const { match } = require("assert");
//GET => '/api/v1/movies/'
exports.getMovie = async (req, res) => {
  try {
    const features = new ApiFeatures(Movie.find(), req.query)
      .filter()
      .sort()
      .limitFields();
      // .paginate();

    let movies = await features.query;

    //GETTING THE DATA FROM THE DATABASE
    // const movies=await query;
    return res.status(200).json({
      status: "success",
      length: movies.length,
      data: { movies },
      message: "Movies fetched successfully",
    });
  } catch (error) {
    return res.status(404).json({
      status: "error",
      message: error.message,
    });
  }
};
// app.get("/api/v1/movies/:id",getMovieWithId);
//GET => '/api/v1/movies/:id'
exports.getMovieWithId = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    return res.status(200).json({
      status: "success",
      data: {
        movie,
      },
      message: "Movie fetched successfully",
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};
// app.get("/api/v1/movies/movie-stats",getMovieStats);
//GET => '/api/v1/movies/movie-stats'
exports.getMovieStats = async (req, res) => {
  try {
    const stats = await Movie.aggregate([
      { $match: { ratings: { $gte: 4 } } },
      {
        $group: {
          _id: '$releaseYear',
          avgRating: { $avg: "$rating" },
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
          priceTotal: { $sum: "$price" },
          movieCount: { $sum: 1 },
        },
      },
      { $sort: { minPrice: 1 } },
      { $match: { maxPrice: { $gte: 60 } } }
    ]);

    return res.status(200).json({
      status: "success",
      count: stats.length,
      data: { stats },
      message: "Movie stats fetched successfully",
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};
// app.get("/api/v1/movies/:id",getMovieWithId);
//POST => '/api/v1/movies/'
exports.createsNewMovie = async (req, res) => {
  try {
    const newMovie = await Movie.create(req.body);
    return res.status(201).json({
      status: "success",
      data: {
        newMovie,
      },
      message: "Movie created successfully",
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};
// app.post("/api/v1/movies",createsNewMovie);
//PATCH => '/api/v1/movies/:id'
exports.updateChunkMovie = async (req, res) => {
  try {
    const updatedMovie = await Movie.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    return res.status(200).json({
      status: "success",
      data: {
        movie: updatedMovie,
      },
      message: "Movie updated successfully",
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};
// app.patch("/api/v1/movies/:id",updateChunkMovie);
//PUT => '/api/v1/movies/:id'
exports.updateEntireMovie = (req, res) => {};
// app.put("/api/v1/movies/:id",updateEntireMovie);
//DELETE => '/api/v1/movies/:id'
exports.deleteMovie = async (req, res) => {
  try {
    await Movie.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      status: "success",
      message: "Movie deleted successfully",
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};
exports.getMovieByGenre=async(req,res)=>{
  try
  {
    
    const genre=req.params.genre;
    const movies = await Movie.aggregate([
      {$unwind: '$genres'},
      {
        $group:{
          _id: "$genres",
          moviesCount:{$sum:1},
          movies:{$push:"$name"}
        }
      },
      {$addFields:{genre:"$_id"}},
      {$project:{_id:0,genre:1,moviesCount:1,movies:1}},
      {$sort:{moviesCount:-1}},
      {$match:{genre:genre}}
    ]);
    return res.status(200).json({
      status:"success",
      count:movies.length,
      data:{movies},
      message:`Movies of genre ${genre} fetched successfully`
    });
  }
  catch (error)
  {
    return res.status(400).json({
      status:"error",
      message:error.message
    });
  }
};

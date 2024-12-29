const express = require("express"); //returns a function that creates an Express application
// const app = express();
const moviesController = require('../Controllers/moviesController');
const authController = require('../Controllers/authController');
//NOW WE WILL BE USING THE MIDDLEWARE CUSTOMIZING IT !
const router = express.Router();
//ROUTE for the documents upon which we perform AGGREGATE-PIPELINE FUNCTIONS
router.route("/movie-stats").get(moviesController.getMovieStats);
//ROUTE for the documents upon which we perform AGGREGATE-PIPELINE FUNCTIONS for getting movies by genres
router.route("/movie-by-genre/:genre").get(moviesController.getMovieByGenre);
// we are categorizing our routes based on HTTP methods which is '/api/v1/movies'
router.route("/")
        .get(authController.protect,moviesController.getMovie)
        .post(authController.protect,moviesController.createsNewMovie);

// we are categorizing our routes based on HTTP methods which is '/api/v1/movies'
router.route("/:id")
        .get(authController.protect,authController.restrict('admin'),moviesController.getMovieWithId)
        .patch(authController.protect,authController.restrict('admin'),moviesController.updateChunkMovie)//we are using the middleware to protect the route and restrict the route to only admin
        // .put(moviesController.updateEntireMovie)
        .delete(authController.protect,authController.restrict('admin'),moviesController.deleteMovie);//we are using the middleware to protect the route and restrict the route to only admin
module.exports = router;
const Movie = require("../../models/Movie");

// The reason that this function is the only notFound validator other than the notFoundHandler is because this is the only function being called in routes other than movie routes
// which contains the router param for the routes respective id. I can just import the router param for movies from the movie routes and be done with it but I don't want to put more than one
// router param in a single routes file.
exports.movieNotFound = async (req, res, next) => {
  const movie = await Movie.findById(req.body.movies);
  if (!movie)
    return next({
      status: 404,
      message: "Movie not found. Therefore, can't be added.",
    });
  return next();
};

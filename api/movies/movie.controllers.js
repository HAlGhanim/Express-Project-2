const Movie = require("../../models/Movie");

exports.fetchMovie = async (movieId, next) => {
  try {
    const movie = await Movie.findById(movieId).select("-__v");
    return movie;
  } catch (error) {
    return next(error);
  }
};

exports.getMovies = async (req, res, next) => {
  try {
    const movies = await Movie.find().select("-__v");
    return res.status(200).json(movies);
  } catch (error) {
    return next(error);
  }
};

exports.getMovieById = async (req, res, next) => {
  try {
    return res.status(200).json(req.movie);
  } catch (error) {
    return next(error);
  }
};

exports.createMovie = async (req, res, next) => {
  try {
    if (!req.user.staff)
      return next({
        status: 401,
        message: "You don't have permission to add a Movie.",
      });
    const movie = await Movie.create(req.body);
    return res.status(201).json(movie);
  } catch (error) {
    return next(error);
  }
};

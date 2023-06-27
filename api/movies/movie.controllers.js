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
    const { page, limit } = req.query;
    const movies = await Movie.find()
      .select("-__v -actors -reviews")
      .populate("genre", "name -_id")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    const count = await Movie.countDocuments();
    return res.status(200).json({
      movies,
      totalPages: Math.ceil(count / limit),
      currentPage: +page,
    });
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
    const newMovie = await Movie.create(req.body);
    return res.status(201).json(newMovie);
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

exports.deleteMovie = async (req, res, next) => {
  try {
    if (!req.user.staff)
      return next({
        status: 401,
        message: "You don't have permission to delete a Movie.",
      });
    await Movie.findByIdAndRemove({ _id: req.movie.id });
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
};

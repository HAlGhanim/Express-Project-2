const Genre = require("../../models/Genres");
const Movie = require("../../models/Movie");
const {
  unauthorized,
  alreadyAdded,
  notFound,
} = require("../../middlewares/controllerErrors");

exports.fetchGenre = async (genreId, next) => {
  try {
    const genre = await Genre.findById(genreId).select("-__v");
    return genre;
  } catch (error) {
    return next(error);
  }
};

exports.getGenres = async (req, res, next) => {
  try {
    const genres = await Genre.find()
      .select("-__v")
      .populate("movies", "name -_id");
    return res.status(200).json(genres);
  } catch (error) {
    return next(error);
  }
};

exports.addGenre = async (req, res, next) => {
  try {
    if (!req.user.staff) return next(unauthorized);
    const newGenre = await Genre.create(req.body);
    return res.status(201).json(newGenre);
  } catch (error) {
    return next(error);
  }
};

exports.deleteGenre = async (req, res, next) => {
  try {
    if (!req.user.staff) return next(unauthorized);
    await req.genre.deleteOne();
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
};

exports.addGenreToMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.body.movies);
    if (!req.user.staff) return next(unauthorized);
    if (req.genre.movies.includes(req.body.movies)) return next(alreadyAdded);
    if (!movie) return next(notFound);
    await req.genre.updateOne({ $push: { movies: req.body.movies } });
    await Movie.findByIdAndUpdate(req.body.movies, {
      $push: { genre: req.genre._id },
    });
    return res.status(200).end();
  } catch (error) {
    return next(error);
  }
};

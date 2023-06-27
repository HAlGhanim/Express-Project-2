const Genre = require("../../models/Genres");
const Movie = require("../../models/Movie");

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
    const genres = await Genre.find().select("-__v").populate("movies", "name -_id");
    return res.status(200).json(genres);
  } catch (error) {
    return next(error);
  }
};

exports.addGenre = async (req, res, next) => {
  try {
    if (!req.user.staff) {
      return next({
        status: 401,
        message: "You must be a staff member to add a genre.",
      });
    }
    const genre = await Genre.create(req.body);
    return res.status(201).json(genre);
  } catch (error) {
    return next(error);
  }
};

exports.deleteGenre = async (req, res, next) => {
  try {
    if (!req.user.staff) {
      return next({
        status: 401,
        message: "You don't have permission to delete a genre.",
      });
    }
    await Genre.findByIdAndRemove({ _id: req.genre.id });
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
};

exports.addGenreToMovie = async (req, res, next) => {
  try {
    console.log(req.user.staff);
    if (!req.user.staff) {
      return next({
        status: 401,
        message: "You don't have permission to add a genre to a movie.",
      });
    }
    const { movieId } = req.params;
    const foundMovie = await Movie.findById({ _id: movieId });
    if (!foundMovie) return next({ status: 404, message: "Movie not found" });
    if (foundMovie.genre.includes(req.genre._id))
      return next({ status: 400, message: "Genre already added to movie" });
    await foundMovie.updateOne({ $push: { genre: req.genre._id } });
    await req.genre.updateOne({ $push: { movies: foundMovie._id } });
    return res.status(200).end();
  } catch (error) {
    return next(error);
  }
};

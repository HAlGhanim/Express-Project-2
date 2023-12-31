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
    const newGenre = await Genre.create(req.body);
    return res.status(201).json(newGenre);
  } catch (error) {
    return next(error);
  }
};

exports.deleteGenre = async (req, res, next) => {
  try {
    console.log(req.genre.name);
    await Movie.updateMany(
      { genre: req.genre },
      { $pull: { genre: req.genre._id } }
    );
    await req.genre.deleteOne();
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
};

exports.addGenreToMovie = async (req, res, next) => {
  try {
    await req.genre.updateOne({ $push: { movies: req.body.movies } });
    await Movie.updateOne(
      { _id: req.body.movies },
      {
        $push: { genre: req.genre._id },
      }
    );
    return res.status(200).end();
  } catch (error) {
    return next(error);
  }
};

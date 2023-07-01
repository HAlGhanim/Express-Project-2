const Movie = require("../../models/Movie");

exports.ExsistingGenre = (req, res, next) => {
  if (req.genre.movies.includes(req.body.movies))
    return next({
      status: 400,
      message: "Genre already exists",
    });
};

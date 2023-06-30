const Actor = require("../models/Actor");
const Genre = require("../models/Genres");
const Movie = require("../models/Movie");

exports.unauthorized = (req, res, next) => {
  if (!req.user.staff)
    return next({
      status: 401,
      message: "You don't have permission to perfom this action.",
    });
  return next();
};

exports.signupImage = (req, res, next) => {
  if (req.file) {
    req.body.image = `media/${req.file.filename}`;
    console.log(req.body.image);
    next();
  } else {
    res.status(400).json({ error: "No file uploaded" });
  }
};

exports.notFound = {
  status: 404,
  message: "Can't find it",
};

exports.imposter = (req, res, next) => {
  if (req.body.userId && req.body.userId !== String(req.user._id))
    return next({
      status: 401,
      message: "The id in the body does not match the id of the user",
    });
  return next();
};

exports.ratingValidations = (req, res, next) => {
  if (req.body.rating > 10 || req.body.rating <= 0) {
    return next({ status: 400, message: "Rating must be between 1 and 10" });
  }
  return next();
};

exports.existingActor = async (req, res, next) => {
  const actorFilter = await Actor.findOne({
    name: req.body.name,
    role: req.body.role,
  });
  console.log(actorFilter);
  if (actorFilter)
    return next({
      status: 400,
      message: "Already exists",
    });
  return next();
};

exports.existingMovieActor = (req, res, next) => {
  if (req.actor.movies.includes(req.body.movies))
    return next({ status: 400, message: "The actor is already in this movie" });
  return next();
};

exports.movieNotFound = async (req, res, next) => {
  const movie = await Movie.findById(req.body.movies);
  if (!movie)
    return next({
      status: 404,
      message: "Movie not found. Therefore, actor can't be added",
    });
  return next();
};

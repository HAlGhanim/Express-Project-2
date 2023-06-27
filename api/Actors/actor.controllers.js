const Actor = require("../../models/Actor");
const Movie = require("../../models/Movie");

exports.fetchActor = async (actorId, next) => {
  try {
    const actor = await Actor.findById(actorId).select("-__v");
    return actor;
  } catch (error) {
    return next(error);
  }
};

exports.getActors = async (req, res, next) => {
  try {
    const actors = await Actor.find().select("-__v").populate("movies", "name");
    return res.status(200).json(actors);
  } catch (error) {
    return next(error);
  }
};

exports.addActor = async (req, res, next) => {
  try {
    if (!req.user.staff) {
      return next({
        status: 401,
        message: "You must be a staff member to add an actor.",
      });
    }
    const actor = await Actor.create(req.body);
    return res.status(201).json(actor);
  } catch (error) {
    return next(error);
  }
};

exports.deleteActor = async (req, res, next) => {
  try {
    if (!req.user.staff) {
      return next({
        status: 401,
        message: "You don't have permission to delete an actor.",
      });
    }
    await Actor.findByIdAndRemove({ _id: req.actor.id });
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
};

exports.addActorToMovie = async (req, res, next) => {
  try {
    if (!req.user.staff) {
      return next({
        status: 401,
        message: "You don't have permission to add an actor to a movie.",
      });
    }
    const { movieId } = req.params;
    const foundMovie = await Movie.findById({ _id: movieId });
    if (!foundMovie) return next({ status: 404, message: "Movie not found" });
    if (foundMovie.actors.includes(req.actor._id))
      return next({ status: 400, message: "Actor already added to movie" });
    await foundMovie.updateOne({
      $push: { actors: req.actor._id },
    });
    await req.actor.updateOne({ $push: { movies: foundMovie._id } });
    return res.status(200).end();
  } catch (error) {
    return next(error);
  }
};

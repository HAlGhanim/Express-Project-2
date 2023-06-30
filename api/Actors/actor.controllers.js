const Actor = require("../../models/Actor");
const Movie = require("../../models/Movie");
const {
  notFound,
  alreadyExsists,
} = require("../../middlewares/ifStatements");

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
    const actors = await Actor.find()
      .select("-__v")
      .populate("movies", "name -_id");
    return res.status(200).json(actors);
  } catch (error) {
    return next(error);
  }
};

exports.addActor = async (req, res, next) => {
  try {
    const newActor = await Actor.create(req.body);
    return res.status(201).json(newActor);
  } catch (error) {
    return next(error);
  }
};

exports.deleteActor = async (req, res, next) => {
  try {
    await req.actor.deleteOne();
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
};

exports.addActorToMovie = async (req, res, next) => {
  try {
    await req.actor.updateOne({ $push: { movies: req.body.movies } });
    await Movie.findByIdAndUpdate(req.body.movies, {
      $push: { actors: { actor: req.actor._id, role: req.body.role } },
    });
    return res.status(200).end();
  } catch (error) {
    return next(error);
  }
};

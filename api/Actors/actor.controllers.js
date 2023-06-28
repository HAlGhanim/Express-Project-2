const Actor = require("../../models/Actor");
const Movie = require("../../models/Movie");
const {
  unauthorized,
  notFound,
  alreadyExsists,
} = require("../../middlewares/controllerErrors");

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
    if (!req.user.staff) return next(unauthorized);

    const actorFilter = await Actor.findOne({
      name: req.body.name,
      role: req.body.role,
    });
    if (actorFilter) return next(alreadyExsists);
    const newActor = await Actor.create(req.body);
    return res.status(201).json(newActor);
  } catch (error) {
    return next(error.message);
  }
};

exports.deleteActor = async (req, res, next) => {
  try {
    if (!req.user.staff) return next(unauthorized);

    await req.actor.deleteOne();
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
};

exports.addActorToMovie = async (req, res, next) => {
  try {
    if (!req.user.staff) return next(unauthorized);

    if (req.actor.movies.includes(req.body.movies)) return next(alreadyExsists);
    if (!(await Movie.findById(req.body.movies))) return next(notFound);
    await req.actor.updateOne({ $push: { movies: req.body.movies } });
    await Movie.findByIdAndUpdate(req.body.movies, {
      $push: { actors: req.actor._id },
    });
    return res.status(200).end();
  } catch (error) {
    return next(error);
  }
};

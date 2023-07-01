const Actor = require("../../models/Actor");
const Movie = require("../../models/Movie");

exports.existingActor = async (req, res, next) => {
  const actorFilter = await Actor.findOne({
    name: req.body.name,
    role: req.body.role,
  });
  console.log(actorFilter);
  if (actorFilter)
    return next({
      status: 400,
      message: "Actor already exists",
    });
  return next();
};

exports.exsistingRole = async (req, res, next) => {
  const role = await Movie.find({ actors: { role: req.body.role } });
  if (role)
    return next({ status: 400, message: "The role is already in this movie" });
};

exports.existingMovieActor = (req, res, next) => {
  if (req.actor.movies.includes(req.body.movies))
    return next({ status: 400, message: "The actor is already in this movie" });
  return next();
};

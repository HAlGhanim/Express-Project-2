const express = require("express");
const router = express.Router();
const passport = require("passport");
const { unauthorized } = require("../../middlewares/permissions/staff");
const { movieNotFound } = require("../../middlewares/movies/movieValidators");
const {
  existingActor,
  existingMovieActor,
  exsistingRole,
} = require("../../middlewares/actors/actorValidators");
const {
  getActors,
  addActor,
  fetchActor,
  deleteActor,
  addActorToMovie,
} = require("./actor.controllers");

router.param("actorId", async (req, res, next, actorId) => {
  try {
    const foundActor = await fetchActor(actorId);
    if (!foundActor) return next({ status: 404, message: "Actor not found" });
    req.actor = foundActor;
    next();
  } catch (error) {
    return next(error);
  }
});

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  unauthorized,
  existingActor,
  addActor
);
router.get("/", getActors);
router.delete(
  "/:actorId",
  passport.authenticate("jwt", { session: false }),
  unauthorized,
  deleteActor
);

router.post(
  "/:actorId",
  passport.authenticate("jwt", { session: false }),
  unauthorized,
  movieNotFound,
  existingMovieActor,
  exsistingRole,
  addActorToMovie
);
module.exports = router;

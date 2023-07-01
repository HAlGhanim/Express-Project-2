const express = require("express");
const router = express.Router();
const passport = require("passport");
const { unauthorized } = require("../../middlewares/permissions/staff");
const {
  ratingValidations,
  imposter,
  existingReview,
} = require("../../middlewares/movies/reviewValidators");
const {
  fetchMovie,
  getMovies,
  createMovie,
  getMovieById,
  deleteMovie,
  addReview,
} = require("./movie.controllers");
const { byIdAvgCalc } = require("../../middlewares/movies/avgCalc");

router.param("movieId", async (req, res, next, movieId) => {
  try {
    const foundMovie = await fetchMovie(movieId);
    if (!foundMovie) return next({ status: 404, message: "Movie not found" });
    req.movie = foundMovie;
    next();
  } catch (error) {
    return next(error);
  }
});

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  unauthorized,
  createMovie
);

router.get("/", getMovies);
router.get("/:movieId", byIdAvgCalc, getMovieById);
router.delete(
  "/:movieId",
  passport.authenticate("jwt", { session: false }),
  unauthorized,
  deleteMovie
);

router.post(
  "/:movieId",
  passport.authenticate("jwt", { session: false }),
  ratingValidations,
  imposter,
  existingReview,
  addReview
);
module.exports = router;

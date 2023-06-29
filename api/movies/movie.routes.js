const express = require("express");
const router = express.Router();
const passport = require("passport");
const {
  fetchMovie,
  getMovies,
  createMovie,
  getMovieById,
  deleteMovie,
  addReview,
} = require("./movie.controllers");

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

router.post("/", passport.authenticate("jwt", { session: false }), createMovie);

router.get("/", getMovies);
router.get("/:movieId", getMovieById);
router.delete(
  "/:movieId",
  passport.authenticate("jwt", { session: false }),
  deleteMovie
);

router.post(
  "/:movieId",
  passport.authenticate("jwt", { session: false }),
  addReview
);
module.exports = router;

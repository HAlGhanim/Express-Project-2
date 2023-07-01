const express = require("express");
const router = express.Router();
const passport = require("passport");
const { unauthorized } = require("../../middlewares/permissions/staff");
const { ExsistingGenre } = require("../../middlewares/genres/genreValidators");
const { movieNotFound } = require("../../middlewares/movies/movieValidators");
const {
  getGenres,
  fetchGenre,
  addGenre,
  deleteGenre,
  addGenreToMovie,
} = require("./genre.controllers");

router.param("genreId", async (req, res, next, genreId) => {
  try {
    const foundGenre = await fetchGenre(genreId);
    if (!foundGenre) return next({ status: 404, message: "Genre not found" });
    req.genre = foundGenre;
    next();
  } catch (error) {
    return next(error);
  }
});

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  unauthorized,
  addGenre
);
router.get("/", getGenres);
router.delete(
  "/:genreId",
  passport.authenticate("jwt", { session: false }),
  unauthorized,
  deleteGenre
);
router.post(
  "/:genreId",
  passport.authenticate("jwt", { session: false }),
  unauthorized,
  movieNotFound,
  ExsistingGenre,
  addGenreToMovie
);
module.exports = router;

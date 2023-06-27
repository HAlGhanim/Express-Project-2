const express = require("express");
const passport = require("passport");
const router = express.Router();
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
  "/addGenre",
  passport.authenticate("jwt", { session: false }),
  addGenre
);
router.get("/", getGenres);
router.delete(
  "/delete/:genreId",
  passport.authenticate("jwt", { session: false }),
  deleteGenre
);
router.post(
  "/:genreId/:movieId",
  passport.authenticate("jwt", { session: false }),
  addGenreToMovie
);
module.exports = router;

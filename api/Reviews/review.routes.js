const express = require("express");
const router = express.Router();
const passport = require("passport");
const {
  getReviews,
  addReview,
  fetchReview,
  deleteReview,
} = require("./review.controllers");

router.param("reviewId", async (req, res, next, reviewId) => {
  try {
    const foundReview = await fetchReview(reviewId);
    if (!foundReview) return next({ status: 404, message: "Review not found" });
    req.review = foundReview;
    next();
  } catch (error) {
    return next(error);
  }
});

router.post(
  "/addReview",
  passport.authenticate("jwt", { session: false }),
  addReview
);
router.get("/", getReviews);
router.delete(
  "/delete/:reviewId",
  passport.authenticate("jwt", { session: false }),
  deleteReview
);

module.exports = router;
const express = require("express");
const router = express.Router();
const passport = require("passport");
const {
  getReviews,
  fetchReview,
  deleteReview,
  getMyReviews,
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

router.get("/", getReviews);
router.get(
  "/myReviews",
  passport.authenticate("jwt", { session: false }),
  getMyReviews
);
router.delete(
  "/:reviewId",
  passport.authenticate("jwt", { session: false }),
  deleteReview
);

module.exports = router;

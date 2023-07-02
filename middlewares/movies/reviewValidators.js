const Review = require("../../models/Review");

exports.imposter = (req, res, next) => {
  if (req.body.userId && req.body.userId !== String(req.user._id))
    return next({
      status: 401,
      message: "The id in the body does not match your id.",
    });
  return next();
};

exports.ratingValidations = (req, res, next) => {
  if (req.body.rating > 10 || req.body.rating <= 0) {
    return next({ status: 400, message: "Rating must be between 1 and 10." });
  }
  return next();
};

exports.existingReview = async (req, res, next) => {
  const existingReview = await Review.findOne({
    movieId: req.movie._id,
    userId: req.user._id,
  });
  if (existingReview)
    return next({
      status: 401,
      message: "You have already reviewed this movie.",
    });
  return next();
};

exports.deleteValidation = async (req, res, next) => {
  if (!req.review.userId.equals(req.user._id))
    return next({
      status: 401,
      message: "You can't delete someone else's review",
    });
  return next();
};

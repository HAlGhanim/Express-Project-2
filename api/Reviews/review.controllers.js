const Review = require("../../models/Review");

exports.fetchReview = async (reviewId, next) => {
  try {
    const review = await Review.findById(reviewId).select("-__v");
    return review;
  } catch (error) {
    return next(error);
  }
};

exports.getReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find().select("-__v");
    return res.status(200).json(reviews);
  } catch (error) {
    return next(error);
  }
};

exports.addReview = async (req, res, next) => {
  try {
    if (!req.user.staff) {
      return next({
        status: 401,
        message: "You must be a staff member to add a review.",
      });
    }
    const review = await Review.create(req.body);
    return res.status(201).json(review);
  } catch (error) {
    return next(error);
  }
};

exports.deleteReview = async (req, res, next) => {
  try {

    if (!req.user.staff) {
      return next({
        status: 401,
        message: "You don't have permission to delete a review.",
      });
    }
    await Review.findByIdAndRemove({ _id: req.review.id });
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
};

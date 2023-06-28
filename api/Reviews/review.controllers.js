const Review = require("../../models/Review");
const {
  unauthorized,
  alreadyAdded,
  notFound,
} = require("../../middlewares/controllerErrors");

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
    if (!req.user.staff) return next(unauthorized);
    const newReview = await Review.create(req.body);
    return res.status(201).json(newReview);
  } catch (error) {
    return next(error);
  }
};

exports.deleteReview = async (req, res, next) => {
  try {
    if (!req.user.staff) return next(unauthorized);
    await req.review.deleteOne();
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
};

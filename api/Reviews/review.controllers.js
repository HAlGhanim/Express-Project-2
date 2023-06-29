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

exports.deleteReview = async (req, res, next) => {
  try {
    if (!req.user.staff) return next(unauthorized);
    await req.review.deleteOne();
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
};

exports.addReview = async (req, res, next) => {
  try {
    // if (req.user.reviews.includes(req.movie)) return next(alreadyExsists);
    // if (req.review.movies.includes(req.movie)) return next(alreadyExsists);
    // if (!(await Movie.findById(req.body.movies))) return next(notFound);
    await req.user.updateOne({ $push: { reviews: req.body } });
    await Movie.findByIdAndUpdate(req.body.movieId, {
      $push: { reviews: req.body },
    });
    return res.status(200).end();
  } catch (error) {
    return next(error);
  }
};

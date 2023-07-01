const Review = require("../../models/Review");
const Movie = require("../../models/Movie");

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
    const { page, limit } = req.query;
    const reviews = await Review.find()
      .select("-__v")
      .populate("movieId userId", "name username")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    const count = await Review.countDocuments();
    return res.status(200).json({
      reviews,
      totalPages: Math.ceil(count / limit),
      currentPage: +page,
    });
  } catch (error) {
    return next(error);
  }
};

exports.getMyReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ userId: req.user._id })
      .select("-__v -userId")
      .populate("movieId", "name");
    return res.status(200).json(reviews);
  } catch (error) {
    return next(error);
  }
};

exports.deleteReview = async (req, res, next) => {
  try {
    await req.review.deleteOne();
    await Movie.updateOne(
      { _id: req.review.movieId },
      { $pull: { reviews: req.review._id } }
    );
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
};

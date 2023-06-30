const Movie = require("../../models/Movie");
const Review = require("../../models/Review");
const {
  alreadyExsists,
} = require("../../middlewares/ifStatements");

exports.fetchMovie = async (movieId, next) => {
  try {
    const movie = await Movie.findById(movieId)
      .select("-__v")
      .populate(
        "genre actors.actor reviews",
        "name role -_id text rating userId"
      );
    return movie;
  } catch (error) {
    return next(error);
  }
};

exports.getMovies = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const movies = await Movie.find()
      .select("-__v -actors._id")
      .populate(
        "genre actors.actor reviews",
        "name role -_id text rating userId"
      )
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    const count = await Movie.countDocuments();
    const ratings = movies.map((movie) => {
      const totalRating = movie.reviews.reduce(
        (sum, review) => sum + review.rating,
        0
      );
      const averageRating = totalRating / movie.reviews.length;
      return { ...movie._doc, avgRating: averageRating };
    });
    return res.status(200).json({
      movies: ratings,
      totalPages: Math.ceil(count / limit),
      currentPage: +page,
    });
  } catch (error) {
    return next(error);
  }
};

exports.getMovieById = async (req, res, next) => {
  try {
    console.log(req.movie);
    const totalRating = req.movie.avgRating.reduce(
      (sum, rating) => sum + rating
    );
    const averageRating = totalRating / req.movie.avgRating.length;
    req.movie.avgRating = averageRating;
    return res.status(200).json(req.movie);
  } catch (error) {
    return next(error);
  }
};

exports.createMovie = async (req, res, next) => {
  try {
    const newMovie = await Movie.create(req.body);
    return res.status(201).json(newMovie);
  } catch (error) {
    return next(error);
  }
};

exports.deleteMovie = async (req, res, next) => {
  try {
    await req.movie.deleteOne();
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
};

exports.addReview = async (req, res, next) => {
  try {
    const existingReview = await Review.findOne({
      movieId: req.movie._id,
      userId: req.user._id,
    });
    if (existingReview) return next(alreadyExsists);
    const review = await Review.create({
      ...req.body,
      movieId: req.movie._id,
      userId: req.user._id,
    });
    await req.movie.updateOne({
      $push: { reviews: review._id, avgRating: review.rating },
    });
    return res.status(200).end();
  } catch (error) {
    return next(error);
  }
};

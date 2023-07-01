const Movie = require("../../models/Movie");
const Review = require("../../models/Review");

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
    //magic
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
    await Review.deleteMany({ movieId: req.movie._id });
    await req.movie.deleteOne();
    await Movie.updateOne(
      { _id: req.movie._id },
      { $set: { reviews: [], avgRating: 0 } }
    );
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
};

exports.addReview = async (req, res, next) => {
  try {
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

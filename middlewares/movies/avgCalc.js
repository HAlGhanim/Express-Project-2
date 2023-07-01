exports.byIdAvgCalc = (req, res, next) => {
  const totalRating = req.movie.reviews.reduce(
    (sum, review) => (review ? sum + review.rating : sum),
    0
  );
  const avgRating =
    req.movie.reviews.filter((review) => review).length > 0
      ? totalRating / req.movie.reviews.filter((review) => review).length
      : 0;
  const movieWithAvgRating = {
    ...req.movie._doc,
    avgRating: avgRating,
  };
  return res.status(200).json(movieWithAvgRating), next();
};

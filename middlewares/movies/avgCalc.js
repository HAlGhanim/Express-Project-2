exports.byIdAvgCalc = (req, res, next) => {
  const totalRating = req.movie.avgRating.reduce((sum, rating) => sum + rating);
  req.movie.avgRating = totalRating / req.movie.avgRating.length;
  return next();
};

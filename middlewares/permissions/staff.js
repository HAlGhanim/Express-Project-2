exports.unauthorized = (req, res, next) => {
  if (!req.user.staff)
    return next({
      status: 401,
      message: "You don't have permission to perfom this action.",
    });
  return next();
};

const bcrypt = require("bcrypt");
exports.exsistingUpdateValidation = async (req, res, next) => {
  if (req.body.username === req.user.username)
    return next({ status: 400, message: "Try adding a new username." });
  const passwordMatch = await bcrypt.compare(
    req.body.password,
    req.user.password,
    (err, res) => {
      if (res)
        return next({ status: 400, message: "Try adding a new password." });
    }
  );
  if (passwordMatch) {
    return next({ status: 400, message: "Try adding a new password." });
  }
  if (req.body.email === req.user.email)
    return next({ status: 400, message: "Try adding a new email." });
  if (req.body.reviews)
    return next({
      status: 403,
      message: "You are not allowed to update your reviews.",
    });
  return next();
};

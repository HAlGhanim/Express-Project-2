const express = require("express");
const {
  deleteUser,
  fetchUser,
  signin,
  signup,
  getUsers,
} = require("./user.controllers");
const router = express.Router();
const passport = require("passport");
const upload = require("../../middlewares/multer");
const {
  validation,
  fieldValidation,
} = require("../../middlewares/signupValidation");
const { unauthorized, signupImage } = require("../../middlewares/ifStatements");

router.param("userId", async (req, res, next, userId) => {
  try {
    const foundUser = await fetchUser(userId);
    if (!foundUser) return next({ status: 404, message: "User not found" });
    req.foundUser = foundUser;
    next();
  } catch (error) {
    return next(error);
  }
});

router.post(
  "/signup",
  upload.single("image"),
  signupImage,
  validation(),
  fieldValidation,
  signup
);
router.post(
  "/signin",
  passport.authenticate("local", { session: false }),
  signin
);
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  unauthorized,
  getUsers
);
router.delete(
  "/:userId",
  passport.authenticate("jwt", { session: false }),
  unauthorized,
  deleteUser
);

module.exports = router;

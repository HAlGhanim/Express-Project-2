const express = require("express");
const router = express.Router();
const passport = require("passport");
const upload = require("../../middlewares/images/multer");
const { unauthorized } = require("../../middlewares/permissions/staff");
const { signupImage } = require("../../middlewares/images/pImage");
const {
  fieldValidation,
  validation,
} = require("../../middlewares/users/signupValidation");
const {
  deleteUser,
  fetchUser,
  signin,
  signup,
  getUsers,
  updateUser,
} = require("./user.controllers");
const { hashing } = require("../../middlewares/users/password");

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
  hashing,
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
router.put(
  "/",
  passport.authenticate("jwt", { session: false }),
  hashing,
  updateUser
);
router.delete(
  "/:userId",
  passport.authenticate("jwt", { session: false }),
  unauthorized,
  deleteUser
);

module.exports = router;

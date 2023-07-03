const express = require("express");
const router = express.Router();
const passport = require("passport");
const upload = require("../../middlewares/images/multer");
const { unauthorized } = require("../../middlewares/permissions/staff");
const { signupImage } = require("../../middlewares/images/pImage");
const { hashing } = require("../../utils/auth/password");
const {
  exsistingUpdateValidation,
} = require("../../middlewares/users/exsistingUpdateValidation");
const {
  deleteUser,
  fetchUser,
  signin,
  signup,
  getUsers,
  updateUser,
} = require("./user.controllers");
const {
  FieldValidation,
  inputValidator,
  passwordValidator,
  emailValidator,
} = require("../../middlewares/users/userValidation");

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
  inputValidator([...emailValidator, ...passwordValidator], true),
  FieldValidation,
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
  inputValidator([...emailValidator, ...passwordValidator], false),
  FieldValidation,
  exsistingUpdateValidation,
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

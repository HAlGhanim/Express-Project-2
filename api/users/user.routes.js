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

// Everything with the word temp is a placeholder that you'll change in accordance with your project

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

router.post("/signup", upload.single("image"), signup);
router.post(
  "/signin",
  passport.authenticate("local", { session: false }),
  signin
);
router.get(
  "/users",
  passport.authenticate("jwt", { session: false }),
  getUsers
);
router.delete(
  "/delete/:userId",
  passport.authenticate("jwt", { session: false }),
  deleteUser
);

module.exports = router;

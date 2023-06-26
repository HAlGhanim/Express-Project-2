const express = require("express");
const {
  updateUser,
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
    req.user = foundUser;
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
router.get("/users", getUsers);
router.put("/update/:userId", updateUser);
router.delete("/delete/:userId", deleteUser);

module.exports = router;

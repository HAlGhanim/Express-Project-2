const User = require("../../models/User");
const passHash = require("../../utils/auth/passhash");
const generateToken = require("../../utils/auth/generateToken");

// Everything with the word User is a placeholder that you'll change in accordance with your project

exports.fetchUser = async (userId, next) => {
  try {
    const user = await User.findById(userId);
    return user;
  } catch (error) {
    return next(error);
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    if (!req.user.staff) {
      return next({
        status: 401,
        message: "You are not authorized to view users.",
      });
    }
    const users = await User.find().select("-__v");
    return res.status(200).json(users);
  } catch (error) {
    return next(error);
  }
};

exports.signup = async (req, res, next) => {
  try {
    if (req.file) {
      req.body.image = `${req.file.path}`;
      req.body.image = `media/${req.file.filename}`;
      console.log(req.body.image);
    }
    const { password } = req.body;
    req.body.password = await passHash(password);
    req.body.staff = false;
    const newUser = await User.create(req.body);
    const token = generateToken(newUser);
    res.status(201).json({ token });
  } catch (err) {
    return res.status(500).json(err.message);
  }
};

exports.signin = async (req, res) => {
  try {
    const token = generateToken(req.user);
    return res.status(200).json({ token });
  } catch (err) {
    return res.status(500).json(err.message);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    if (!req.user.staff) {
      return next({
        status: 401,
        message: "You are not authorized to delete users.",
      });
    }
    await User.findByIdAndRemove({ _id: req.foundUser.id });
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
};

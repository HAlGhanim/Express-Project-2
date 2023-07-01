const User = require("../../models/User");
const Review = require("../../models/Review");
const generateToken = require("../../utils/auth/generateToken");

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
    const users = await User.find().select("-__v -reviews");
    return res.status(200).json(users);
  } catch (error) {
    return next(error);
  }
};

exports.signup = async (req, res, next) => {
  try {
    delete req.body.staff;
    const newUser = await User.create(req.body);
    const token = generateToken(newUser);
    res.status(201).json({ token });
  } catch (error) {
    return next(error);
  }
};

exports.signin = async (req, res) => {
  try {
    const token = generateToken(req.user);
    return res.status(200).json({ token });
  } catch (error) {
    return next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    await req.user.updateOne(req.body);
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    await Review.deleteMany({ userId: req.foundUser._id });
    await User.findByIdAndRemove({ _id: req.foundUser.id });
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
};

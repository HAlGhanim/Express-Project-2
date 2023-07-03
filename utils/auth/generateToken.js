const jwt = require("jsonwebtoken");
const config = require("../../config/keys");

module.exports = (user) => {
  const payload = {
    _id: user._id,
    username: user.username,
    email: user.email,
    staff: user.staff,
  };
  const token = jwt.sign(payload, config.JWT_SECRET, {
    expiresIn: config.JWT_TOKEN_EXP,
  });
  return token;
};

const bcrypt = require("bcrypt");

const passHash = async (password) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

const hashing = async (req, res, next) => {
  const { password } = req.body;
  req.body.password = await passHash(password);
  return next();
};

module.exports = {
  hashing,
};

const { check, validationResult } = require("express-validator");

const validation = () => {
  return [
    check("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long."),
    check("password")
      .matches(/\d/)
      .withMessage("Password must contain a number."),
    check("password")
      .matches(/[A-Z]/)
      .withMessage("Password must contain an uppercase letter."),
    check("password")
      .matches(/[a-z]/)
      .withMessage("Password must contain a lowercase letter."),
    check("password")
      .matches(/[!@#$%^&*(),.?":{}|<>]/)
      .withMessage("Password must contain a symbol."),
    check("email").isEmail().withMessage("Email must be valid."),
  ];
};

const fieldValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  const extractedErrors = [];
  errors
    .array()
    .map((error) => extractedErrors.push({ [error.path]: error.msg }));

  return res.status(422).json({
    errors: extractedErrors,
  });
};

module.exports = {
  validation,
  fieldValidation,
};

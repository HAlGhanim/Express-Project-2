exports.signupImage = (req, res, next) => {
  if (req.file) {
    req.body.image = `media/${req.file.filename}`;
    next();
  } else {
    res.status(400).json({ error: "No image uploaded" });
  }
};

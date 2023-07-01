exports.signupImage = (req, res, next) => {
  if (req.file) {
    req.body.image = `media/${req.file.filename}`;
    console.log(req.body.image);
    next();
  } else {
    res.status(400).json({ error: "No file uploaded" });
  }
};

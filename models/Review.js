const { model, Schema } = require("mongoose");

const ReviewSchema = new Schema({
  rating: { type: Number, required: true },
  reviewText: { type: String, required: true },
  movieId: { type: Schema.Types.ObjectId, ref: "Movie" },
  userId: { type: Schema.Types.ObjectId, ref: "User" },
});

module.exports = model("Review", ReviewSchema);

const { model, Schema } = require("mongoose");

const ReviewSchema = new Schema({
  rating: { type: Number, required: true },
  reviewText: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  movieId: { type: Schema.Types.ObjectId, required: true, ref: "Movie" },
});

module.exports = model("Review", ReviewSchema);

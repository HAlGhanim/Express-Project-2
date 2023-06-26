const { model, Schema } = require("mongoose");

const ReviewSchema = new Schema({
  movieId: [{ type: Schema.Types.ObjectId, ref: "Movie" }],
  userId: [{ type: Schema.Types.ObjectId, ref: "User" }],
  reviewText: [{ type: String, required: true }],
  rating: [{ type: String, required: true }],
});

module.exports = model("Review", ReviewSchema);

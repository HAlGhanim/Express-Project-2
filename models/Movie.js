const { model, Schema } = require("mongoose");
// Everything with the word temp is a placeholder that you'll change in accordance with your project

const MovieSchema = new Schema({
  name: { type: String, unique: true, required: true },
  actors: [
    {
      actor: { type: Schema.Types.ObjectId, ref: "Actor" },
      role: {type: String, required: true},
    },
  ],
  genre: [{ type: Schema.Types.ObjectId, ref: "Genre" }],
  releaseDate: { type: Date, required: true },
  avgRating: [Number],
  reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
});

module.exports = model("Movie", MovieSchema);

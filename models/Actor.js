const { model, Schema } = require("mongoose");
// Everything with the word temp is a placeholder that you'll change in accordance with your project

const ActorSchema = new Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  movies: [{ type: Schema.Types.ObjectId, ref: "Movie" }],
});

module.exports = model("Actor", ActorSchema);

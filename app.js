const express = require("express");
const connectDb = require("./database");
const cors = require("cors");
const morgan = require("morgan");
const app = express();
const userRoutes = require("./api/Users/user.routes");
const movieRoutes = require("./api/movies/movie.routes");
const actorRoutes = require("./api/Actors/actor.routes");
const genreRoutes = require("./api/Genres/genre.routes");
const reviewRoutes = require("./api/Reviews/review.routes");
const config = require("./config/keys");
const passport = require("passport");
const {
  localStrategy,
  jwtStrategy,
} = require("./middlewares/passport/passport");
const notFoundHandler = require("./middlewares/errors/notFoundHandler");
const errorHandler = require("./middlewares/errors/errorHandler");

app.use(cors());
connectDb();
app.use(express.json());
app.use(morgan("dev"));

app.use(passport.initialize());
passport.use("local", localStrategy);
passport.use(jwtStrategy);

app.use("/users", userRoutes);
app.use("/movies", movieRoutes);
app.use("/actors", actorRoutes);
app.use("/genres", genreRoutes);
app.use("/reviews", reviewRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(config.PORT, () => {
  console.log(`The application is running on ${config.PORT}`);
});

module.exports = app;

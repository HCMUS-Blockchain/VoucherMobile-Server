const createError = require("http-errors");
const express = require("express");
require("dotenv").config();
require("./models/db");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const vouchersRouter = require("./routes/vouchers");
const randomRouter = require("./routes/random");
const compaignRouter = require("./routes/campaign");
const gameRouter = require("./routes/game");
const categoryRouter = require("./routes/category");
const counterpartRouter = require("./routes/counterpart");
const puzzleRouter = require("./routes/puzzle");
const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/vouchers", vouchersRouter);
app.use("/random", randomRouter);
app.use("/api", compaignRouter);
app.use("/game", gameRouter);
app.use("/category", categoryRouter);
app.use("/counterpart", counterpartRouter);
app.use("/puzzle", puzzleRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;

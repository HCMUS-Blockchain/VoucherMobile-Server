const Game = require("../models/game");
const Quiz = require("../models/quiz");
exports.createGame = async (req, res) => {
  try {
    let body = {};
    body.pointAverage = JSON.parse(req.body.pointAverage);
    body.name = req.body.id;
    body.id = req.body.id;
    const game = new Game(body);
    await game.save();
    res
      .status(201)
      .send({ success: true, message: "Campaign created successfully" });
  } catch (e) {
    res.status(400).send({ success: false, message: e.message });
  }
};

exports.getOnceGame = async (req, res) => {
  try {
    const game = await Game.find({ id: req.params.id });
    res.status(200).send({
      success: true,
      message: "Get a game successfully",
      game,
    });
  } catch (e) {
    res.status(400).send({ success: false, message: e.message });
  }
};

exports.updateGame = async (req, res) => {
  try {
    await Game.updateOne(
      { id: req.body.id },
      { $set: { pointAverage: JSON.parse(req.body.pointAverage) } }
    );
    res.status(200).send({
      success: true,
      message: "Update a game successfully",
    });
  } catch (e) {
    res.status(400).send({ success: false, message: e.message });
  }
};

// --------------------------------------------
exports.createQuiz = async (req, res) => {
  try {
    req.body.questions = JSON.parse(req.body.questions);
    const quiz = new Quiz(req.body);

    await quiz.save();
    res
      .status(201)
      .send({ success: true, message: "Quiz created successfully" });
  } catch (e) {
    console.log(e);
    res.status(400).send({ success: false, message: e.message });
  }
};

exports.updateQuiz = async (req, res) => {
  try {
    req.body.questions = JSON.parse(req.body.questions);
    await Quiz.updateOne({ _id: req.body._id }, req.body);
    res
      .status(201)
      .send({ success: true, message: "Quiz updated successfully" });
  } catch (e) {
    console.log(e);
    res.status(400).send({ success: false, message: e.message });
  }
};

exports.getOnceQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.find({ _id: req.params.id });
    res.status(200).send({
      success: true,
      message: "Get a quiz successfully",
      quiz,
    });
  } catch (e) {
    res.status(400).send({ success: false, message: e.message });
  }
};

exports.getAllQuiz = async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    res.status(200).send({
      success: true,
      message: "Get all quizzes successfully",
      quizzes,
    });
  } catch (e) {
    res.status(400).send({ success: false, message: e.message });
  }
};

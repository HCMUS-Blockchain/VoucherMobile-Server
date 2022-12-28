const mongoose = require("mongoose");
const questionAndAnswerSchema = mongoose.Schema(
  {
    question: {
      type: String,
    },
    optionA: {
      type: String,
    },
    optionB: {
      type: String,
    },
    optionC: {
      type: String,
    },
    optionD: {
      type: String,
    },
    answer: {
      type: String,
    },
  },
  { _id: false }
);

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  questions: [questionAndAnswerSchema],
});
module.exports = mongoose.model("Quiz", quizSchema);

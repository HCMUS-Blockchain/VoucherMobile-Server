const express = require("express");
const {
  createGame,
  getOnceGame,
  updateGame,
  createQuiz,
  getOnceQuiz,
  getAllQuiz,
  updateQuiz,
} = require("../controllers/game");
const { isAuth, isCounterpart } = require("../middlewares/auth");
const router = express.Router();

router.post("/collection", isAuth, createQuiz);
router.put("/collection", isAuth, isCounterpart, updateQuiz);
router.get("/collection/:id", isAuth, getOnceQuiz);
router.get("/collection", isAuth, isCounterpart, getAllQuiz);
router.get("/:id", isAuth, isCounterpart, getOnceGame);
router.post("/", isAuth, isCounterpart, createGame);
router.put("/", isAuth, isCounterpart, updateGame);

module.exports = router;

const express = require("express");
const {
  createGame,
  getOnceGame,
  updateGame,
  createQuiz,
  getOnceQuiz,
  getAllQuiz,
} = require("../controllers/game");
const router = express.Router();

router.post("/", createGame);
router.get("/collection", getAllQuiz);
router.get("/:id", getOnceGame);
router.put("/", updateGame);
router.post("/collection", createQuiz);
router.get("/collection/:id", getOnceQuiz);

module.exports = router;

const express = require("express");
const { isAuth } = require("../middlewares/auth");
const {
  createCounterpart,
  getCounterpart,
  updateCounterpart,
} = require("../controllers/counterpart");
const router = express.Router();

router.get("/", isAuth, getCounterpart);
router.post("/", isAuth, createCounterpart);
router.put("/", isAuth, updateCounterpart);

module.exports = router;

const express = require("express");
const { isAuth } = require("../middlewares/auth");
const {
  createCounterpart,
  getCounterpart,
  updateCounterpart, getPopularBranch,
} = require("../controllers/counterpart");
const router = express.Router();

router.get("/", isAuth, getCounterpart);
router.post("/", isAuth, createCounterpart);
router.put("/", isAuth, updateCounterpart);
router.get("/v1/popular-branch", isAuth, getPopularBranch);
module.exports = router;

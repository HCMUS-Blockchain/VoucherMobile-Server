const express = require("express");
const {
  getGeneralStatistic,
  getVoucherStatistic,
} = require("../controllers/statistic");
const { isAuth, isCounterpart } = require("../middlewares/auth");
const router = express.Router();

router.get("/:option", isAuth, isCounterpart, getGeneralStatistic);
router.post("/", isAuth, isCounterpart, getVoucherStatistic);

module.exports = router;

const express = require("express");
const { getGeneralStatistic } = require("../controllers/statistic");
const { isAuth, isCounterpart } = require("../middlewares/auth");
const router = express.Router();

router.get("/:option", isAuth, isCounterpart, getGeneralStatistic);
module.exports = router;

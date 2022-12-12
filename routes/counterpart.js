const express = require('express');
const {isAuth} = require("../middlewares/auth");
const {createCounterpart} = require("../controllers/counterpart");
const router = express.Router();

router.post('/add', isAuth, createCounterpart)
module.exports = router;

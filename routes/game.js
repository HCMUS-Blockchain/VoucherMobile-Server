const express = require('express');
const {createGame, getDataQuizGame} = require("../controllers/game");
const {isAuth} = require("../middlewares/auth");
const router = express.Router();


router.post('/create', isAuth, createGame)
router.get('/getDataQuizGame', isAuth,getDataQuizGame)
module.exports = router;

const express = require('express');
const {createGame, getDataQuizGame, getGameInfor} = require("../controllers/game");
const {isAuth} = require("../middlewares/auth");
const router = express.Router();


router.post('/create', isAuth, createGame)
router.get('/getDataQuizGame', isAuth,getDataQuizGame)
router.post('/get', isAuth,getGameInfor)
module.exports = router;

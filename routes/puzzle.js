const express = require('express');
const {isAuth} = require("../middlewares/auth");
const {addPuzzle, getAll, sendPuzzleFriend, sendPuzzleEveryone} = require("../controllers/puzzle");
const path = require("path");
const router = express.Router();

router.post('/add', isAuth, addPuzzle);
router.post('/', isAuth, getAll)
router.post('/send-friend', isAuth, sendPuzzleFriend)
router.post('/send-everyone', isAuth, sendPuzzleEveryone)


module.exports = router;

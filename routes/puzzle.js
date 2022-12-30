const express = require('express');
const {isAuth, authRole} = require("../middlewares/auth");
const {addPuzzle, getAll, sendPuzzleFriend, sendPuzzleEveryone} = require("../controllers/puzzle");
const path = require("path");
const {playPuzzle} = require("../controllers/voucher");
const router = express.Router();

router.post('/add', isAuth, addPuzzle);
router.post('/', isAuth, getAll)
router.post('/send-friend', isAuth, sendPuzzleFriend)
router.post('/send-everyone', isAuth, sendPuzzleEveryone)
router.post('/play', isAuth,authRole(ROLE.USER),playPuzzle);


module.exports = router;

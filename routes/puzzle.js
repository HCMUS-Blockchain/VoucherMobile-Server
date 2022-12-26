const express = require('express');
const {isAuth} = require("../middlewares/auth");
const {addPuzzle, getAll, sendPuzzleFriend, sendPuzzleEveryone} = require("../controllers/puzzle");
const path = require("path");
const router = express.Router();

router.post('/add', isAuth, addPuzzle);
router.post('/', isAuth, getAll)
router.post('/send-friend', isAuth, sendPuzzleFriend)
router.post('/send-everyone', isAuth, sendPuzzleEveryone)
router.get('/:id', function (req, res, next) {
    console.log(req.params.id)
    const puzzleId = req.params.id;
    res.sendFile(path.join(__dirname, '/test1.html'));
})

module.exports = router;

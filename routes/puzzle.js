const express = require('express');
const {isAuth} = require("../middlewares/auth");
const {addPuzzle, getAll, sendPuzzle} = require("../controllers/puzzle");
const path = require("path");
const router = express.Router();

router.post('/add', isAuth, addPuzzle);
router.post('/', isAuth, getAll)
router.post('/send',isAuth,sendPuzzle)
router.get('/:id', function (req, res, next) {
    const puzzleId = req.params.id;
    res.sendFile(path.join(__dirname, '/test1.html'));
})

module.exports = router;

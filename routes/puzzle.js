const express = require('express');
const {isAuth} = require("../middlewares/auth");
const {addPuzzle} = require("../controllers/puzzle");
const router = express.Router();

router.post('/add', isAuth, addPuzzle);
module.exports = router;

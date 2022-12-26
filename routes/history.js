const express = require('express');
const {isAuth} = require("../middlewares/auth");
const {addHistory, getAll} = require("../controllers/history");
const router = express.Router();

router.post('/add', isAuth, addHistory);
router.get('/', isAuth, getAll)
module.exports = router;


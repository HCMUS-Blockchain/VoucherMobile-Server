const express = require('express');
const router = express.Router();
const {isAuth} = require("../middlewares/auth");
const {createVoucher, addVoucher, getAllVouchersById, playGame} = require("../controllers/voucher");
router.post('/create',createVoucher);
router.post('/add', isAuth,addVoucher);
router.get('/getAll',isAuth,getAllVouchersById)
router.post('/playgame', isAuth,playGame);
module.exports = router;

const express = require('express');
const router = express.Router();
const {isAuth} = require("../middlewares/auth");
const {createVoucher, addVoucher, getAllVouchersById, playGame, getAllVouchersAndCategory, getAllVouchersByCategoryName} = require("../controllers/voucher");
router.post('/create', isAuth,createVoucher);
router.post('/add', isAuth,addVoucher);
router.get('/getAll',isAuth,getAllVouchersById)
router.post('/playgame', isAuth,playGame);
router.post('/getAll',isAuth,getAllVouchersById)
router.post('/vouchers-category',isAuth,getAllVouchersAndCategory)
router.post('/category', isAuth, getAllVouchersByCategoryName)
module.exports = router;

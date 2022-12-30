const express = require('express');
const router = express.Router();
const {isAuth} = require("../middlewares/auth");
const {createVoucher, addVoucher, getAllVouchersById, playGame, getAllVouchersAndCategory, getAllVouchersByCategoryName,
    searchVouchersByDescriptionAndShop, playPuzzle
} = require("../controllers/voucher");
router.post('/create', isAuth,createVoucher);
router.post('/add', isAuth,addVoucher);
router.get('/getAll',isAuth,getAllVouchersById)
router.post('/playgame', isAuth,playGame);
router.post('/playpuzzle', isAuth,playPuzzle);
router.post('/getAll',isAuth,getAllVouchersById)
router.post('/vouchers-category',isAuth,getAllVouchersAndCategory)
router.post('/category', isAuth, getAllVouchersByCategoryName)
router.post('/search',isAuth,searchVouchersByDescriptionAndShop)
module.exports = router;

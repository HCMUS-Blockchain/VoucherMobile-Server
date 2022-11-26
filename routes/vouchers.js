const express = require('express');
const router = express.Router();
const {isAuth} = require("../middlewares/auth");
const {createVoucher, addVoucher} = require("../controllers/voucher");
router.post('/create', isAuth,createVoucher);
router.post('/add', isAuth,addVoucher);
module.exports = router;

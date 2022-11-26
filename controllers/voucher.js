const Voucher = require('../models/voucher');
const {add} = require("nodemon/lib/rules");
const User = require('../models/user');
exports.createVoucher = async (req, res) => {
    try{
        const voucher = new Voucher(req.body);
        console.log(req.body);
        await voucher.save();
        res.status(201).send({success: true, message: 'Voucher created successfully'});
    }catch (e) {
        res.status(400).send({success: false, message: e.message});
    }
}

exports.addVoucher = async (req, res) => {
    try{
        const {userId, voucherId} = req.body;
        await User.findByIdAndUpdate(userId, {$push: {vouchers: voucherId}, new: true, useFindAndModify: false});
    }catch (e) {
        res.status(400).send({success: false, message: e.message});
    }
    res.status(201).send({success: true, message: 'Voucher added successfully'});
}

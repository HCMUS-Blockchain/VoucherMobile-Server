const Voucher = require('../models/voucher');
const User = require('../models/user');
const {interaction} = require("../scripts/interaction");
exports.createVoucher = async (req, res) => {
    try{
        const voucher = new Voucher(req.body);
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

exports.getAllVouchersById = async (req, res) => {
    try {
        const {userId} = req.query;
        const vouchers = await User.findById(userId).populate('vouchers');
    }catch (e) {
        res.status(400).send({success: false, message: e.message});
    }
}


exports.playGame = async (req, res) => {
    try{
        const {userId, points, gameType, campaignId} = req.body;
        if (points >=0 && points <= 10){
            const countVoucher = await getCampaignInThisCampaignAndDiscount(campaignId, 30);
            if (countVoucher.length > 0){
                const voucher_ = countVoucher[0];
                await setVoucherInformation(voucher_._id, gameType, new Date());
                await User.findByIdAndUpdate(userId, {$push: {vouchers: voucher_._id}, new: true, useFindAndModify: false});
                interaction().then(async (x) => {
                    console.log(x);
                    const voucher = await Voucher.findByIdAndUpdate(voucher_._id, {code: x}, {new: true, useFindAndModify: false});
                    res.status(201).send({success: true, message: 'Voucher added successfully',
                        voucher});
                }).catch((e) => {
                    res.status(400).send({success: false, message: e.message});
                });
            }else{
                res.status(400).send({success: false, message: 'No voucher available'});
            }
        }
        else if (points >=11 && points <= 50){
            const countVoucher = await getCampaignInThisCampaignAndDiscount(campaignId, 45);
            if (countVoucher.length > 0){
                const voucher = countVoucher[0];
                await setVoucherInformation(voucher._id, gameType, new Date());
                await User.findByIdAndUpdate(userId, {$push: {vouchers: voucher._id}, new: true, useFindAndModify: false});
                interaction().then(async (x) => {
                    await Voucher.findByIdAndUpdate(voucher._id, {code: x}, {new: true, useFindAndModify: false});
                    res.status(201).send({success: true, message: 'Voucher added successfully',
                        voucher});
                }).catch((e) => {
                    res.status(400).send({success: false, message: e.message});
                });
            }else{
                res.status(400).send({success: false, message: 'No voucher available'});
            }
        }else if (points >=51){
            const countVoucher = await getCampaignInThisCampaignAndDiscount(campaignId, 60);
            if (countVoucher.length > 0){
                const voucher = countVoucher[0];
                await setVoucherInformation(voucher._id, gameType, new Date());
                await User.findByIdAndUpdate(userId, {$push: {vouchers: voucher._id}, new: true, useFindAndModify: false});
                interaction().then(async (x) => {
                    await Voucher.findByIdAndUpdate(voucher._id, {code: x}, {new: true, useFindAndModify: false});
                    res.status(201).send({success: true, message: 'Voucher added successfully',
                        voucher});
                }).catch((e) => {
                    res.status(400).send({success: false, message: e.message});
                });
            }else{
                res.status(400).send({success: false, message: 'No voucher available'});
            }
        }
    }catch (e) {
        res.status(400).send({success: false, message: e.message});
    }
}

const setVoucherInformation = async (voucherId,game,timeGet) => {
    try{
        await Voucher.findByIdAndUpdate(voucherId, {available: false,game,timeGet}, {new: true, useFindAndModify: false});
    }catch (e) {
        throw new Error(e.message);
    }
}
const getCampaignInThisCampaignAndDiscount = async (campaignId,discount) => {
    try {
        return await Voucher.find({campaign: campaignId, discount, available: true});
    }catch (e) {
        throw new Error(e.message);
    }
}


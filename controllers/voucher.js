const Voucher = require('../models/voucher');
const User = require('../models/user');
const {getRandomNumberBaseOnUniswap} = require("../scripts/getRandomNumber");
const Category = require('../models/category');
const Game = require("../models/game");
const {findPointAndDiscount} = require("./game");
const Puzzle = require('../models/puzzle');
exports.createVoucher = async (req, res) => {
    try {
        const voucher = new Voucher(req.body);
        await voucher.save();
        res.status(201).send({success: true, message: 'Voucher created successfully'});
    } catch (e) {
        res.status(400).send({success: false, message: e.message});
    }
}

exports.addVoucher = async (req, res) => {
    try {
        const {userId, voucherId} = req.body;
        await User.findByIdAndUpdate(userId, {$push: {vouchers: voucherId}, new: true, useFindAndModify: false});
    } catch (e) {
        res.status(400).send({success: false, message: e.message});
    }
    res.status(201).send({success: true, message: 'Voucher added successfully'});
}

exports.getAllVouchersById = async (req, res) => {
    try {
        const userId = req.user._id
        const user = await User.findById(userId).populate('vouchers');
        const vouchers = user.vouchers;
        res.status(200).send({success: true, message: 'Get all vouchers successfully', vouchers});
    } catch (e) {
        res.status(400).send({success: false, message: e.message});
    }
}

exports.getAllVouchersByCategoryName = async (req, res) => {
    try {
        const userId = req.user._id
        const category = req.body.category;
        const user = await User.findById(userId).populate('vouchers')
        if (category === 'All') {
            const vouchers = user.vouchers;
            res.status(200).send({success: true, message: 'Get all vouchers successfully', vouchers});
        } else {
            const vouchers = []
            for (let i = 0; i < user.vouchers.length; i++) {
                const categoryFinding = await Category.findById(user.vouchers[i].category);
                if (categoryFinding.name === category) {
                    vouchers.push(user.vouchers[i])
                }
            }
            res.status(200).send({success: true, message: 'Get all vouchers successfully', vouchers});
        }
    } catch (e) {
        res.status(400).send({success: false, message: e.message});
    }
}

exports.getAllVouchersAndCategory = async (req, res) => {
    try {
        const userId = req.user._id
        const user = await User.findById(userId).populate('vouchers');
        const categories = await Category.find();
        const data = {vouchers: user.vouchers, categories};
        res.status(200).send({success: true, message: 'Get all vouchers successfully', data});
    } catch (e) {
        res.status(400).send({success: false, message: e.message});
    }
}

exports.searchVouchersByDescriptionAndShop = async (req, res) => {
    try {
        const {keyword} = req.body;
        if (keyword === '') {
            const vouchers = await Voucher.find();
            res.status(200).send({success: true, message: 'Get all vouchers successfully', vouchers});
        } else {
            const vouchersFind = await Voucher.find().populate('campaign');
            console.log(vouchersFind)
            const vouchers = vouchersFind.filter(voucher => {
                return voucher.description.toLowerCase().includes(keyword.toLowerCase()) || voucher.campaign.shop.toLowerCase().includes(keyword.toLowerCase());
            })
            res.status(200).send({success: true, message: 'Get all vouchers successfully', vouchers});
        }
    } catch (e) {
        res.status(400).send({success: false, message: e.message});
    }
}

//getVoucher
exports.playGame = async (req, res) => {
    try {
        const {points, gameType, campaignId} = req.body;
        const userId = req.user._id
        const user = await User.findById(userId);
        if (user) {
            const game = await Game.findOne({name: gameType})
            let {pointRs, discountRs} = findPointAndDiscount(points, game)
            const countVoucher = await getCampaignInThisCampaignAndDiscount(campaignId, discountRs);
            if (countVoucher.length > 0) {
                const voucher_ = countVoucher[0];
                await setVoucherInformation(voucher_._id, gameType, new Date());
                await User.findByIdAndUpdate(userId, {
                    $push: {vouchers: voucher_._id},
                    new: true,
                    useFindAndModify: false
                });
                getRandomNumberBaseOnUniswap().then(async (x) => {
                    console.log(x);
                    const voucher = await Voucher.findByIdAndUpdate(voucher_._id, {code: x}, {
                        new: true,
                        useFindAndModify: false
                    });
                    res.status(201).send({
                        success: true, message: 'Voucher added successfully',
                        voucher
                    });
                }).catch((e) => {
                    res.status(400).send({success: false, message: e.message});
                });
            } else {
                res.status(400).send({success: false, message: 'No voucher available'});
            }
        } else {
            res.status(400).send({success: false, message: 'No user'});
        }
    } catch (e) {
        res.status(400).send({success: false, message: e.message});
    }
}

//getPuzzle
exports.playPuzzle = async (req, res) => {
    try {
        const {name} = req.body;
        const userId = req.user._id
        const puzzleMapDb = await Puzzle.findOne({name})
        if (puzzleMapDb) {
            const user = await User.findById(userId);
            if (user) {
                getRandomNumberBaseOnUniswap().then(async (x) => {
                    const convertInRange = findRangeOfRandomNumber(1, 105, x);
                    const puzzleGetByUserId = await Puzzle.findOne({user: userId});
                    if (puzzleGetByUserId) {
                        const piece = checkRarityAndReturnPuzzle(convertInRange, puzzleGetByUserId);
                        puzzleGetByUserId[piece].quantity = puzzleGetByUserId[piece].quantity + 1;
                        const result = await Puzzle.findByIdAndUpdate(puzzleGetByUserId._id,puzzleGetByUserId,
                            {
                                new: true,
                                useFindAndModify: false
                            })
                        res.status(201).send({
                            success: true, message: 'successfully', data: {
                                convertInRange,
                                piece,
                                result
                            }
                        });
                    } else {
                        const newPuzzle = {
                            user: userId,
                            piece_1:puzzleMapDb.piece_1,
                            piece_2:puzzleMapDb.piece_2,
                            piece_3:puzzleMapDb.piece_3,
                            piece_4:puzzleMapDb.piece_4,
                            piece_5:puzzleMapDb.piece_5,
                            piece_6:puzzleMapDb.piece_6,
                            piece_7:puzzleMapDb.piece_7,
                            piece_8:puzzleMapDb.piece_8,
                            piece_9:puzzleMapDb.piece_9,
                        }
                        const puzzleAdding = await Puzzle.create(newPuzzle);
                        const piece = checkRarityAndReturnPuzzle(convertInRange, puzzleAdding);
                        puzzleAdding[piece].quantity = puzzleAdding[piece].quantity + 1;
                        const result = await Puzzle.findByIdAndUpdate(puzzleAdding._id,puzzleAdding,
                            {
                                new: true,
                                useFindAndModify: false
                            })
                        res.status(201).send({
                            success: true, message: 'successfully', data: {
                                convertInRange,
                                piece,
                                result
                            }
                        });
                    }
                }).catch((e) => {
                    res.status(400).send({success: false, message: e.message});
                });
            } else {
                res.status(400).send({success: false, message: 'User not found'});
            }
        } else {
            res.status(400).send({success: false, message: 'Puzzle not found'});
        }
    } catch (e) {
        res.status(400).send({success: false, message: e.message});
    }
}


const findRangeOfRandomNumber = (min, max, randNumber) => {
    let range = max - min + 1;
    return randNumber % range + min;
}

const checkRarityAndReturnPuzzle = (rarity, object) => {
    for (let i = 1; i <= 9; i++) {
        const nameProps = 'piece_' + i;
        if (object[nameProps].min <= rarity && object[nameProps].max >= rarity) {
            return nameProps
        }
    }
}

const setVoucherInformation = async (voucherId, game, timeGet) => {
    try {
        await Voucher.findByIdAndUpdate(voucherId, {available: false, game, timeGet}, {
            new: true,
            useFindAndModify: false
        });
    } catch (e) {
        throw new Error(e.message);
    }
}

const getCampaignInThisCampaignAndDiscount = async (campaignId, discount) => {
    try {
        return await Voucher.find({campaign: campaignId, discount, available: true});
    } catch (e) {
        throw new Error(e.message);
    }
}


const Voucher = require('../models/voucher');
const User = require('../models/user');
const {getRandomNumberBaseOnUniswap} = require("../scripts/getRandomNumber");
const Category = require('../models/category');
const Game = require("../models/game");
const {findPointAndDiscount} = require("./game");
const Puzzle = require('../models/puzzle');
const Campaign = require('../models/campaign');
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
        console.log(req)
        const user = req.user._id
        const vouchers = await Voucher.find({user})
        res.status(200).send({success: true, message: 'Get all vouchers successfully', vouchers});
    } catch (e) {
        res.status(400).send({success: false, message: e.message});
    }
}

exports.getAllVouchersByCategoryName = async (req, res) => {
    try {
        const user = req.user._id
        const category = req.body.category;
        if (category === 'All') {
            const vouchers = await Voucher.find({user});
            res.status(200).send({success: true, message: 'Get all vouchers successfully', vouchers});
        } else {
            const catFinding = await Category.findOne({name: category})
            if (!catFinding) res.status(400).send({success: false, message: 'No category'});
            const vouchers = await Voucher.find({user, category: catFinding._id});
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
        const user = req.user._id
        if (keyword === '') {
            const vouchers = await Voucher.find({user});
            res.status(200).send({success: true, message: 'Get all vouchers successfully', vouchers});
        } else {
            const vouchersFind = await Voucher.find({user});
            const vouchers = vouchersFind.filter(voucher => {
                return voucher.description.toLowerCase().includes(keyword.toLowerCase()) || voucher.campaign.toLowerCase().includes(keyword.toLowerCase());
            })
            res.status(200).send({success: true, message: 'Get all vouchers successfully', vouchers});
        }
    } catch (e) {
        res.status(400).send({success: false, message: e.message});
    }
}
//function supplement to get voucher
const checkKeywordExistInCampaign = async (campaignId) => {
    const userId = await Campaign.findById(campaignId).select('userId');
    console.log(userId)
}
//getVoucher
exports.playGame = async (req, res) => {
    try {
        const {points, gameType, campaignId} = req.body;
        const userId = req.user._id
        const user = await User.findById(userId);
        if (user) {
            const gameFinding = await Game.findOne({campaignId})
            const gamePoint = gameFinding.pointAverage
            const game = gamePoint[gameType]
            let {pointRs, discountRs} = findPointAndDiscount(points, game)
            console.log(discountRs)
            const countVoucher = await getCampaignInThisCampaignAndDiscount(campaignId, discountRs);
            if (countVoucher.length > 0) {
                const voucher_ = countVoucher[0];
                await setVoucherInformation(voucher_._id, gameType, user._id, new Date());
                await User.findByIdAndUpdate(userId, {
                    $push: {vouchers: voucher_._id},
                    new: true,
                    useFindAndModify: false
                });
                getRandomNumberBaseOnUniswap().then(async (x) => {
                    const voucher = await Voucher.findByIdAndUpdate(voucher_._id, {code: x}, {
                        new: true,
                        useFindAndModify: false
                    });
                    console.log(statisticsOfCampagin(campaignId,userId))
                    if (await statisticsOfCampagin(campaignId, userId)){
                        const campaign = await Campaign.findById(campaignId)
                        console.log(campaign)
                        const userArray = campaign.userJoin
                        userArray.push(userId)
                        await Campaign.findByIdAndUpdate(campaignId, {userJoin: userArray}, {
                            new: true,
                            useFindAndModify: false
                        })
                    }

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

const statisticsOfCampagin =async (camPaign, userId) => {
    const campaign = await Campaign.findById(camPaign)
    const userArray = campaign.userJoin
    console.log(campaign)
    if (userArray.length > 0 && userArray.includes(userId)) {
        return false
    }
    return true
}

//getPuzzle
exports.playPuzzle = async (req, res) => {
    try {
        console.log(req.body)
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
                        puzzleGetByUserId[piece].id.push(x)
                        const imgPiece = puzzleGetByUserId[piece].img;
                        puzzleGetByUserId.lastPieceReceived = {
                            piece,
                            img: imgPiece
                        }
                        const result = await Puzzle.findByIdAndUpdate(puzzleGetByUserId._id, puzzleGetByUserId,
                            {
                                new: true,
                                useFindAndModify: false
                            })
                        const img = result[piece].img;
                        res.status(201).send({
                            success: true, message: 'successfully', data: {
                                convertInRange,
                                piece,
                                img,
                                result
                            }
                        });
                    } else {
                        console.log(puzzleMapDb)
                        const newPuzzle = {
                            user: userId,
                            piece_1: puzzleMapDb.piece_1,
                            piece_2: puzzleMapDb.piece_2,
                            piece_3: puzzleMapDb.piece_3,
                            piece_4: puzzleMapDb.piece_4,
                            piece_5: puzzleMapDb.piece_5,
                            piece_6: puzzleMapDb.piece_6,
                            piece_7: puzzleMapDb.piece_7,
                            piece_8: puzzleMapDb.piece_8,
                            piece_9: puzzleMapDb.piece_9,
                            name: puzzleMapDb.name,
                            lastPieceReceived: puzzleMapDb.lastPieceReceived
                        }
                        const puzzleAdding = await Puzzle.create(newPuzzle);
                        const piece = checkRarityAndReturnPuzzle(convertInRange, puzzleAdding);
                        puzzleAdding[piece].quantity = puzzleAdding[piece].quantity + 1;
                        puzzleAdding[piece].id.push(x)
                        const imgPiece = puzzleAdding[piece].img;
                        puzzleAdding.lastPieceReceived = {
                            piece,
                            img: imgPiece
                        }
                        const result = await Puzzle.findByIdAndUpdate(puzzleAdding._id, puzzleAdding,
                            {
                                new: true,
                                useFindAndModify: false
                            })
                        const img = result[piece].img;
                        res.status(201).send({
                            success: true, message: 'successfully', data: {
                                convertInRange,
                                piece,
                                img,
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

const setVoucherInformation = async (voucherId, game, user, timeGet) => {
    try {
        await Voucher.findByIdAndUpdate(voucherId, {available: false, game, user, timeGet}, {
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


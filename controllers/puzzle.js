const Puzzle = require('../models/puzzle');
const User = require('../models/user')
exports.addPuzzle = async (req, res) => {
    try {

        const puzzle = new Puzzle(req.body);
        const newPuzzle = new Puzzle(puzzle);
        await newPuzzle.save();
        res.status(201).send({success: true, message: 'Puzzle added successfully'});
    } catch (e) {
        res.status(400).send({success: false, message: e.message});
        throw new Error(e.message);
    }
}

exports.getAll = async (req, res) => {
    try {
        const userId = req.user._id
        const puzzles = await Puzzle.findOne({user: userId});
        if (puzzles.length === 0) {
            res.status(200).send({success: true, message: 'No puzzle found', puzzles});
        } else {
            res.status(200).send({success: true, message: 'Get all puzzles successfully', puzzles});
        }
    } catch (e) {
        res.status(400).send({success: false, message: e.message});
    }
}

exports.addPuzzleByPlayGame = async (puzzle) => {
    try {
        const newPuzzle = new Puzzle(puzzle);
        await newPuzzle.save();
    } catch (e) {
        throw new Error(e.message);
    }

}

exports.sendPuzzleFriend = async (req, res) => {
    try {
        const puzzle = req.body;
        const puzzleMapDb = await Puzzle.findOne({
            name: puzzle.name
        })
        if (puzzleMapDb) {
            //handle for send puzzle
            const puzzleId = puzzle.id
            const piece = puzzle.piece
            const userReceiveId = puzzle.userId
            const userSendId = req.user._id
            const userSendFinding = await User.findById(userSendId)
            if (!userSendFinding) return res.status(400).send({success: false, message: "User do not exist"});
            const userReceiveFinding = await User.findById(userReceiveId)
            if (!userReceiveFinding) return res.status(400).send({success: false, message: "User do not exist"});
            const puzzleOfSendUser = await Puzzle.findOne({user: userSendId});
            const puzzleOfPiece = puzzleOfSendUser[piece]
            if (puzzleOfPiece.quantity > 0 && puzzleOfPiece.id.find((id) => id === puzzleId)) {
                puzzleOfPiece.quantity = puzzleOfPiece.quantity - 1
                puzzleOfPiece.id = puzzleOfPiece.id.filter((item) => item !== puzzleId)
                puzzleOfSendUser[piece] = puzzleOfPiece
                const updatePuzzleOfSendUser = await Puzzle.findOneAndUpdate({user: userSendId}, puzzleOfSendUser, {new: true});
                //handle for receive puzzle
                const puzzleOfReceiveUser = await Puzzle.findOne({user: userReceiveId});
                if (puzzleOfReceiveUser) {
                    puzzleOfReceiveUser[piece].quantity = puzzleOfReceiveUser[piece].quantity + 1;
                    puzzleOfReceiveUser[piece].id.push(puzzleId)
                    puzzleOfReceiveUser.lastPieceReceived = {
                        piece,
                        img: puzzleOfReceiveUser[piece].img,
                        nameSending:userSendFinding.fullName,
                        nameReceiving:userReceiveFinding.fullName,
                        sendId:userSendFinding._id
                    }
                    const result = await Puzzle.findByIdAndUpdate(puzzleOfReceiveUser._id, puzzleOfReceiveUser,
                        {
                            new: true,
                            useFindAndModify: false
                        })
                    const pieceReturn = puzzleOfReceiveUser[piece]
                    return res.status(201).send({
                        success: true, message: {
                            piece: pieceReturn,
                        }
                    });
                } else {
                    const newPuzzle = {
                        user: userReceiveId,
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
                    puzzleAdding[piece].quantity = puzzleAdding[piece].quantity + 1;
                    puzzleAdding[piece].id.push(puzzleId)
                    puzzleAdding.lastPieceReceived = {
                        piece,
                        img: puzzleAdding[piece].img,
                        nameSending:userSendFinding.fullName,
                        nameReceiving:userReceiveFinding.fullName,
                        sendId:userSendFinding._id
                    }
                    const result = await Puzzle.findByIdAndUpdate(puzzleAdding._id, puzzleAdding,
                        {
                            new: true,
                            useFindAndModify: false
                        })
                    const pieceReturn = puzzleAdding[piece]
                    return res.status(201).send({
                        success: true, message: {
                            piece: pieceReturn,
                        }
                    });
                }
            } else {
                return res.status(201).send({success: true, message: "You don't have this puzzle"});
            }
        } else {
            return res.status(400).send({success: false, message: 'Game not found'});
        }
    } catch (e) {
        res.status(400).send({success: false, message: e.message});
        throw new Error(e.message);
    }
}

exports.sendPuzzleEveryone = async (req, res) => {
    try {
        const puzzle = req.body;
        const puzzleMapDb = await Puzzle.findOne({
            name: puzzle.name
        })
        if (puzzleMapDb) {
            //handle for send puzzle
            const puzzleId = puzzle.id
            const piece = puzzle.piece
            const userSendId = puzzle.userId
            const userReceiveId = req.user._id
            const userSendFinding = await User.findById(userSendId)
            if (!userSendFinding) return res.status(400).send({success: false, message: "User do not exist"});
            const userReceiveFinding = await User.findById(userReceiveId)
            if (!userReceiveFinding) return res.status(400).send({success: false, message: "User do not exist"});
            const puzzleOfSendUser = await Puzzle.findOne({user: userSendId});
            const puzzleOfPiece = puzzleOfSendUser[piece]
            if (puzzleOfPiece.quantity > 0 && puzzleOfPiece.id.find((id) => id === puzzleId)) {
                puzzleOfPiece.quantity = puzzleOfPiece.quantity - 1
                puzzleOfPiece.id = puzzleOfPiece.id.filter((item) => item !== puzzleId)
                puzzleOfSendUser[piece] = puzzleOfPiece
                const updatePuzzleOfSendUser = await Puzzle.findOneAndUpdate({user: userSendId}, puzzleOfSendUser, {new: true});
                //handle for receive puzzle
                const puzzleOfReceiveUser = await Puzzle.findOne({user: userReceiveId});
                if (puzzleOfReceiveUser) {
                    puzzleOfReceiveUser[piece].quantity = puzzleOfReceiveUser[piece].quantity + 1;
                    puzzleOfReceiveUser[piece].id.push(puzzleId)
                    puzzleOfReceiveUser.lastPieceReceived = {
                        piece,
                        img: puzzleOfReceiveUser[piece].img,
                        nameSending:userSendFinding.fullName,
                        nameReceiving:userReceiveFinding.fullName,
                        sendId:userSendFinding._id
                    }
                    const result = await Puzzle.findByIdAndUpdate(puzzleOfReceiveUser._id, puzzleOfReceiveUser,
                        {
                            new: true,
                            useFindAndModify: false
                        })
                    const pieceReturn = puzzleOfReceiveUser[piece]
                    return res.status(201).send({
                        success: true, message: {
                            piece: pieceReturn,
                        }
                    });
                } else {
                    const newPuzzle = {
                        user: userReceiveId,
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
                        lastPieceReceived: puzzleMapDb.lastPieceReceived,
                    }
                    const puzzleAdding = await Puzzle.create(newPuzzle);
                    puzzleAdding[piece].quantity = puzzleAdding[piece].quantity + 1;
                    puzzleAdding[piece].id.push(puzzleId)
                    puzzleAdding.lastPieceReceived = {
                        piece,
                        img: puzzleAdding[piece].img,
                        nameSending:userSendFinding.fullName,
                        nameReceiving:userReceiveFinding.fullName,
                        sendId:userSendFinding._id
                    }
                    const result = await Puzzle.findByIdAndUpdate(puzzleAdding._id, puzzleAdding,
                        {
                            new: true,
                            useFindAndModify: false
                        })
                    const pieceReturn = puzzleAdding[piece]
                    return res.status(201).send({
                        success: true, message: {
                            piece: pieceReturn,
                        }
                    });
                }
            } else {
                return res.status(201).send({success: true, message: "You don't have this puzzle"});
            }
        } else {
            return res.status(400).send({success: false, message: 'Game not found'});
        }
    } catch (e) {
        res.status(400).send({success: false, message: e.message});
        throw new Error(e.message);
    }
}

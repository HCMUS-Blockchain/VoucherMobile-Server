const Puzzle = require('../models/puzzle');

exports.addPuzzle = async (req,res) => {
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


exports.addPuzzleByPlayGame = async (puzzle) => {
    try {
        const newPuzzle = new Puzzle(puzzle);
        await newPuzzle.save();
    } catch (e) {
        throw new Error(e.message);
    }

}

const Game = require('../models/game');
exports.createGame = async (req, res) => {
    const {name, data, pointAverage} = req.body;
    const newGame = new Game({name, data, pointAverage});
    try {
        await newGame.save();
        return res.status(201).send({success: true, message: 'Game created successfully!'});
    } catch (e) {
        return res.status(400).send({success: false, message: e.message});
    }
}

exports.getDataQuizGame = async (req, res) => {
    try{
        const game = await Game.findOne({name: 'Quiz Game'})
        const data = game.data
        res.status(200).send({success: true, message: 'Get data quiz game successfully', data});
    }catch (e) {
        res.status(400).send({success: false, message: e.message});
    }
}

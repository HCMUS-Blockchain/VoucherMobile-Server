const History = require('../models/history');
exports.addHistory = async (req, res) => {
    const {name, date} = req.body;
    try {
        const newHistory = new History({name, date,type});
        await newHistory.save();
        return res.status(201).send({success: true, message: 'History created successfully!'});
    }catch (e) {
        return res.status(400).send({success: false, message: e.message});
    }
}

exports.getAll = async (req, res) => {
    try {
        const userId = req.user._id
        const histories = await History.find({
            userId
        });
        return res.status(200).send({success: true, message: 'Get all histories successfully', histories});
    } catch (e) {
        return res.status(400).send({success: false, message: e.message});
    }
}

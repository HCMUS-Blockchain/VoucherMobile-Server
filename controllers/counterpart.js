const Counterpart = require('../models/counterpart');
exports.createCounterpart = async (req, res) => {
    try{
        const category = new Counterpart(req.body);
        await category.save();
        res.status(201).send({success: true, message: 'Category created successfully'});
    }catch (e) {
        res.status(400).send({success: false, message: e.message});
    }
}

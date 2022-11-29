const Campaign = require('../models/campaign');

exports.createCampaign = async (req, res) => {
    try{
        const campaign = new Campaign(req.body);
        await campaign.save();
        res.status(201).send({success: true, message: 'Campaign created successfully'});
    }catch (e) {
        res.status(400).send({success: false, message: e.message});
    }
}

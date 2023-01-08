const Campaign = require("../models/campaign");

exports.createCampaign = async (req, res) => {
  try {
    req.body.userID = req.user._id;
    const campaign = new Campaign(req.body);
    await campaign.save();
    res
      .status(201)
      .send({ success: true, message: "Campaign created successfully" });
  } catch (e) {
    res.status(400).send({ success: false, message: e.message });
  }
};

exports.getPopularBranch = async (req, res) => {
  try{
    const campaigns = await Campaign.find().limit(5).sort({totalDonation: -1});
    res.status(200).send({
        success: true,
        message: "Get popular branch successfully",
        campaigns,
    })
  }catch (e) {
    res.status(400).send({ success: false, message: e.message });
  }
}

exports.getNewestCampaign = async (req, res) => {
    try {
        const campaigns = await Campaign.find().limit(5).sort({ createdAt: -1 });
        res.status(200).send({
        success: true,
        message: "Get newest campaign successfully",
        campaigns,
        });
    } catch (e) {
        res.status(400).send({ success: false, message: e.message });
    }
}

exports.getAllCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find({ userID: req.user._id });
    res.status(200).send({
      success: true,
      message: "Get all campaigns successfully",
      campaigns,
    });
  } catch (e) {
    res.status(400).send({ success: false, message: e.message });
  }
};

exports.getOneCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (campaign.userID.valueOf() === req.user._id.valueOf()) {
      res.status(200).send({
        success: true,
        message: "Get a campaign successfully",
        campaign,
      });
    } else {
      res.status(400).send({
        success: true,
        message: "You dont't have permisstion to get a campaign",
        campaign,
      });
    }
  } catch (e) {
    res.status(400).send({ success: false, message: e.message });
  }
};

exports.updateCampaign = async (req, res) => {
  try {
    await Campaign.find({
      $and: [{ userID: req.user._id }, { _id: req.body._id }],
    }).updateOne(req.body);
    res.status(200).send({
      success: true,
      message: "Update a campaign successfully",
    });
  } catch (e) {
    res.status(400).send({ success: false, message: e.message });
  }
};

exports.deleteMultipleCampaign = async (req, res) => {
  try {
    const listID = Object.values(req.query);
    await Campaign.find({
      $and: [{ _id: { $in: listID } }, { userID: req.user._id }],
    }).deleteMany();
    res.status(200).send({
      success: true,
      message: "Delete a campaign's list successfully",
    });
  } catch (e) {
    res.status(400).send({ success: false, message: e.message });
  }
};

exports.deleteSingleCampaign = async (req, res) => {
  try {
    await Campaign.find({
      $and: [{ userID: req.user._id }, { _id: req.params.id }],
    }).deleteOne();
    res.status(200).send({
      success: true,
      message: "Delete a campaign successfully",
    });
  } catch (e) {
    res.status(400).send({ success: false, message: e.message });
  }
};

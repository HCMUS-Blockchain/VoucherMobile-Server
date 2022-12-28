const Campaign = require("../models/campaign");

exports.createCampaign = async (req, res) => {
  try {
    const campaign = new Campaign(req.body);
    await campaign.save();
    res
      .status(201)
      .send({ success: true, message: "Campaign created successfully" });
  } catch (e) {
    res.status(400).send({ success: false, message: e.message });
  }
};

exports.getAllCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find();
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
    res.status(200).send({
      success: true,
      message: "Get a campaign successfully",
      campaign,
    });
  } catch (e) {
    res.status(400).send({ success: false, message: e.message });
  }
};

exports.updateCampaign = async (req, res) => {
  try {
    await Campaign.findByIdAndUpdate(req.body._id, req.body);
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
    await Campaign.deleteMany({ _id: { $in: listID } });
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
    await Campaign.deleteMany({ _id: req.params.id });
    res.status(200).send({
      success: true,
      message: "Delete a campaign successfully",
    });
  } catch (e) {
    res.status(400).send({ success: false, message: e.message });
  }
};

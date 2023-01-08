const Counterpart = require("../models/counterpart");
const User = require("../models/user");
exports.createCounterpart = async (req, res) => {
  try {
    const { fullName, ...counterpart } = req.body;
    counterpart.userID = req.user._id;
    if (req.body.fullName !== req.user.fullName) {
      await User.updateOne(
        { _id: req.user._id },
        { $set: { fullName: req.body.fullName } }
      );
    }
    const newCounterPart = new Counterpart(counterpart);
    await newCounterPart.save();
    res
      .status(201)
      .send({ success: true, message: "Counterpart created successfully" });
  } catch (e) {
    res.status(400).send({ success: false, message: e.message });
  }
};

exports.updateCounterpart = async (req, res) => {
  try {
    const { fullName, ...counterpart } = req.body;
    counterpart.userID = req.user._id;
    if (req.body.fullName !== req.user.fullName) {
      await User.updateOne(
        { _id: req.user._id },
        { $set: { fullName: req.body.fullName } }
      );
    }
    await Counterpart.findByIdAndUpdate(req.body._id, counterpart);
    res
      .status(201)
      .send({ success: true, message: "Counterpart updated successfully" });
  } catch (e) {
    res.status(400).send({ success: false, message: e.message });
  }
};

exports.getCounterpart = async (req, res) => {
  try {
    const counterpart = await Counterpart.findOne({
      userID: req.user._id,
    }).populate("userID");
    let result = {};
    if (counterpart) {
      result = {
        _id: counterpart._id,
        image: counterpart.image,
        nameOfShop: counterpart.nameOfShop,
        phone: counterpart.phone,
        headquarter: counterpart.headquarter,
        fullName: counterpart.userID.fullName,
        email: counterpart.userID.email,
      };
    } else {
      const user = await User.findOne({ _id: req.user._id });
      result = {
        fullName: user.fullName,
        email: user.email,
      };
    }

    res.status(200).send({
      success: true,
      message: "Get a counterpart successfully",
      result,
    });
  } catch (e) {
    console.log(e);
    res.status(400).send({ success: false, message: e.message });
  }
};

exports.getPopularBranch = async (req, res) => {
    try {
        const counterparts = await Counterpart.find()
        .limit(5)
        .sort({ totalDonation: -1 });
        res.status(200).send({
        success: true,
        message: "Get popular branch successfully",
        counterparts,
        });
    } catch (e) {
        res.status(400).send({ success: false, message: e.message });
    }
}

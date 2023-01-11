const Store = require("../models/store");
exports.createStore = async (req, res) => {
  try {
    const temp = req.body.coordinates.split(",");
    const coordinates = {
      latitude: temp[1],
      longitude: temp[0],
    };
    req.body.coordinates = coordinates;
    req.body.ownerID = req.user._id;
    console.log(req.body);
    const store = new Store(req.body);
    await store.save();
    res
      .status(201)
      .send({ success: true, message: "Store created successfully" });
  } catch (e) {
    res.status(400).send({ success: false, message: e.message });
  }
};

exports.getAllStores = async (req, res) => {
  try {
    const stores = await Store.find({ ownerID: req.user._id });
    res.status(200).send({
      success: true,
      message: "Get all stores successfully",
      stores,
    });
  } catch (e) {
    res.status(400).send({ success: false, message: e.message });
  }
};

exports.updateStore = async (req, res) => {
  try {
    const { _id, ownerID, ...body } = req.body;
    const isUpdateCoordinates = req.body.coordinates;
    if (isUpdateCoordinates.includes(",")) {
      const temp = req.body.coordinates.split(",");
      console.log(temp);
      const coordinates = {
        longitude: temp[0],
        latitude: temp[1],
      };
      body.coordinates = coordinates;
    }
    await Store.find({
      $and: [{ ownerID: req.user._id }, { _id: req.body._id }],
    }).updateOne(body);
    res.status(200).send({
      success: true,
      message: "Update a store successfully",
    });
  } catch (e) {
    res.status(400).send({ success: false, message: e.message });
  }
};

exports.getStore = async (req, res) => {
  try {
    const store = await Store.findOne({
      $and: [{ _id: req.params.id }, { ownerID: req.user._id }],
    });
    res.status(200).send({
      success: true,
      message: "Get a store successfully",
      store,
    });
  } catch (e) {
    res.status(400).send({ success: false, message: e.message });
  }
};

exports.deteleStore = async (req, res) => {
  try {
    await Store.find({
      $and: [{ ownerID: req.user._id }, { _id: req.params.id }],
    }).deleteOne();
    res.status(200).send({
      success: true,
      message: "Delete a store successfully",
    });
  } catch (e) {
    res.status(400).send({ success: false, message: e.message });
  }
};

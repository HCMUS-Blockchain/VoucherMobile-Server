const mongoose = require("mongoose");

const gameSubSchema = mongoose.Schema(
  {
    discount: String,
    point: String,
  },
  { _id: false }
);

const gameSchema = new mongoose.Schema({
  name: String,
  pointAverage: {
    game1: [gameSubSchema],
    game2: [gameSubSchema],
    game3: {
      list: [gameSubSchema],
      collectionId: String,
    },
  },
  campaignID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Campaign",
    required: true,
  },
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});
module.exports = mongoose.model("Game", gameSchema);

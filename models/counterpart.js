const mongoose = require("mongoose");
const counterpartSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true,
  },
  nameOfShop: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  headquarter: {
    type: String,
  },
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});
module.exports = mongoose.model("Counterpart", counterpartSchema);

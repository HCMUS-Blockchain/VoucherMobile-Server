const mongoose = require("mongoose");
const campaignSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  image: {
    type: String,
  },
  numberOfVoucher: {
    type: Number,
  },
  dateBegin: {
    type: Number,
  },
  dateEnd: {
    type: Number,
  },
  games: {
    type: Array,
  },
  status: {
    type: String,
  },
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  userJoin: {
    type: Array,
  },
// shop:{
  //     type: String,
  // },
  // counterpart: {
  //     type: mongoose.Schema.Types.ObjectId,
  // }
},
{ timestamps: true }
);
module.exports = mongoose.model("Campaign", campaignSchema);

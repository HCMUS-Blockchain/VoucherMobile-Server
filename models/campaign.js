const mongoose = require('mongoose');
const campaignSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    image: {
        type: String,
    },
    shop:{
        type: String,
    },
    counterpart: {
        type: mongoose.Schema.Types.ObjectId,
    }
})
module.exports = mongoose.model('Campaign', campaignSchema);

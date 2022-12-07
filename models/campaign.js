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
    }
})
module.exports = mongoose.model('Campaign', campaignSchema);

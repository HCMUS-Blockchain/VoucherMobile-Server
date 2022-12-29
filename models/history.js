const mongoose = require('mongoose');


const historySchema = new mongoose.Schema({
    name: {
        type: String,
    },
    date: {
        type: Date,
    },
    type: {
        type: String,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
    },
    image:{
        type: String,
    },
    game:{
        type:String
    },
    message:{
        type:String
    }
})
module.exports = mongoose.model('History', historySchema);

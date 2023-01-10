const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
    },
    image:{
        type: String,
    },
    message:{
        type:String
    },
    date:{
        type:Date,
    },
    seen:{
        type:Boolean,
    }
})
module.exports = mongoose.model('Notification', notificationSchema);

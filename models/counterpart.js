const mongoose = require('mongoose');
const counterpartSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    headquarter: {
        type: String,
    }
})
module.exports = mongoose.model('Counterpart', counterpartSchema);

const mongoose = require('mongoose');
const voucherSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    qrCode: {
        type: String,
        required: true,
    },
    available: {
        type: Boolean,
        required: true,
    },
    discount: {
        type: Number,
        required: true,
    },
    description: {
        type: String
    },
    expiredDate: {
        type: Date,
    },
    createdAt: {
        type: Date,
    },
    usedAt: {
        type: Date,
    }
});

module.exports = mongoose.model('Voucher', voucherSchema);

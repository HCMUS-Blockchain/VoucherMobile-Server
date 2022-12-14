const mongoose = require('mongoose');

const puzzleSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    piece_1:{
        type: Object,
    },
    piece_2:{
        type: Object,
    },
    piece_3:{
        type: Object,
    },
    piece_4:{
        type: Object,
    },
    piece_5:{
        type: Object,
    },
    piece_6:{
        type: Object,
    },
    piece_7:{
        type: Object,
    },
    piece_8:{
        type: Object,
    },
    piece_9:{
        type: Object,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
    }
})
module.exports = mongoose.model('Puzzle', puzzleSchema);

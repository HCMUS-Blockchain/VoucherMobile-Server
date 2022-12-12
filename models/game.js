const mongoose = require('mongoose');


const gameSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    }, data: {
        type: Object,
    }, pointAverage: {
        type:[{
            point:Number,
            discount:Number
        }]
    }
})
module.exports = mongoose.model('Game', gameSchema);

const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    avatar: Buffer
});

userSchema.statics.inThisEmailInUse= async function (email) {
    if(!email) throw new Error('Email is required');
    try{
        const user = await this.findOne({email});
        return !user;
    }catch (e) {
        console.log(e);
        return false;
    }

}
module.exports = mongoose.model('User', userSchema);

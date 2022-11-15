const User = require('../models/user');
exports.createUser = async (req, res) => {
    const {email, password} = req.body;
    const isNewUser = await User.inThisEmailInUse(email);
    if (!isNewUser) return res.status(400).send({'error':'User already registered'});
    const user = await User({email, password}).save();
    return res.json(user)
}

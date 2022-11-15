const User = require('../models/user');
const jwt = require('jsonwebtoken');
exports.createUser = async (req, res) => {
    const {email, password} = req.body;
    const isNewUser = await User.inThisEmailInUse(email);
    if (!isNewUser) return res.status(400).send({'error': 'User already registered'});
    const user = await User({email, password}).save();
    return res.json(user)
}

exports.userSignIn = async (req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if (!user) return res.status(400).send({'error': 'User not found'});
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) return res.status(400).send({'error': 'Password is incorrect'});
    const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET,
        {expiresIn: '1d'})
    return res.json({success: true, user, token})
}

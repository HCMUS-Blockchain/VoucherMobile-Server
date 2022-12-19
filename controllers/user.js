const User = require('../models/user');
const jwt = require('jsonwebtoken');
exports.createUser = async (req, res) => {
    const {fullName, email, password} = req.body;
    const isNewUser = await User.inThisEmailInUse(email);
    if (!isNewUser) return res.status(400).send({'error': 'User already registered'});
    const user = await User({fullName, email, password}).save();
    return res.json({success: true, user})
}

exports.userSignIn = async (req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if (!user) return res.status(400).send({'error': 'User not found'});
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) return res.status(400).send({'error': 'Password is incorrect'});
    const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET,
        {expiresIn: '1d'})
    let oldTokens = user.tokens || [];

    if (oldTokens.length) {
        oldTokens = oldTokens.filter(t => {
            const timeDiff = (Date.now() - parseInt(t.signedAt)) / 1000;
            if (timeDiff < 86400) {
                return t;
            }
        });
    }

    const newToken = {
        tokens: [...oldTokens, {token, signedAt: Date.now().toString()}]
    }
    await User.findByIdAndUpdate(user._id, newToken);

    return res.json({success: true, user, token})
}
exports.signOut = async (req, res) => {
    if (req.headers && req.headers.authorization) {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res
                .status(401)
                .json({success: false, message: 'Authorization fail!'});
        }

        const tokens = req.user.tokens;

        const newTokens = tokens.filter(t => t.token !== token);

        await User.findByIdAndUpdate(req.user._id, {tokens: newTokens});
        res.json({success: true, message: 'Sign out successfully!'});
    }
};
const cloudinary = require("../utils/imageUpload");
exports.uploadAvatar = async (req, res) => {
    const {_id} = req.user;
    if (!_id) return res.status(400).send({'error': 'User not found'});
    try {
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'VoucherHub',
            public_id: `${_id}_profile`,
            width: 500,
            height: 500,
            crop: "fill"
        })
        const updateUser = await User.findByIdAndUpdate(_id, {avatar: result.secure_url});
        const user = {
            _id: updateUser._id,
            fullName: updateUser.fullName,
            email: updateUser.email,
            avatar: result.secure_url};
        res
            .status(201)
            .json({success: true, message: 'Your profile has updated!', user});
    } catch (e) {
        res
            .status(500)
            .json({success: false, message: 'server error, try after some time'});
        console.log('Error while uploading profile image', e.message);
    }
}

const User = require("../models/user");
const jwt = require("jsonwebtoken");

const SECONDS_PER_DAY = 60 * 60 * 24;

exports.createUser = async (req, res) => {
  const { fullName, email, password, role } = req.body;
  const isNewUser = await User.inThisEmailInUse(email);
  if (!isNewUser)
    return res.status(400).send({ error: "User already registered" });
  const user = await User({ fullName, email, password, role }).save();
  return res.json({ success: true, user });
};

exports.userSignIn = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).send({ error: "User not found" });
  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch)
    return res.status(400).send({ error: "Password is incorrect" });
  const token = jwt.sign(
    { _id: user._id, fullName: user.fullName, email: user.email },
    process.env.JWT_SECRET,
    {
      expiresIn: SECONDS_PER_DAY,
    }
  );
  const expiredAt = new Date(Date.now() + SECONDS_PER_DAY * 1000).getTime();

  return res.json({ success: true, user, token, expiredAt: expiredAt });
};
exports.signOut = async (req, res) => {
  if (req.headers && req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Authorization fail!" });
    }

    const tokens = req.user.tokens;

    const newTokens = tokens.filter((t) => t.token !== token);

    await User.findByIdAndUpdate(req.user._id, { tokens: newTokens });
    res.json({ success: true, message: "Sign out successfully!" });
  }
};
const cloudinary = require("../utils/imageUpload");
exports.uploadAvatar = async (req, res) => {
  const { _id } = req.user;
  if (!_id) return res.status(400).send({ error: "User not found" });
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "VoucherHub",
      public_id: `${_id}_profile`,
      width: 500,
      height: 500,
      crop: "fill",
    });
    const updateUser = await User.findByIdAndUpdate(_id, {
      avatar: result.secure_url,
    });
    const user = {
      _id: updateUser._id,
      fullName: updateUser.fullName,
      email: updateUser.email,
      avatar: result.secure_url,
    };
    res
      .status(201)
      .json({ success: true, message: "Your profile has updated!", user });
  } catch (e) {
    res
      .status(500)
      .json({ success: false, message: "server error, try after some time" });
    console.log("Error while uploading profile image", e.message);
  }
};

exports.getProfileUser = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const [tokenType, accessToken] = authHeader.split(" ");
    const payload = jwt.decode(accessToken);
    return res.status(200).json({
      _id: payload._id,
      email: payload.email,
      fullName: payload.fullName,
    });
  } catch (error) {
    console.log("failed to parse token", error);
    return res.status(400).json({ message: "Failed to parse token." });
  }
};

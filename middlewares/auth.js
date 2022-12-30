const jwt = require("jsonwebtoken");
const User = require("../models/user");
exports.isAuth = async (req, res, next) => {
  if (
    req.headers &&
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "JWT"
  ) {
    const token = req.headers.authorization.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded._id);
      if (!user)
        return res
          .status(401)
          .send({ success: false, message: "User not found" });
      req.user = user;
      return next();
    } catch (e) {
      if (e.name === "TokenExpiredError") {
        return res
          .status(401)
          .send({ success: false, message: "Token expired" });
      } else if (e.name === "JsonWebTokenError") {
        return res
          .status(401)
          .send({ success: false, message: "Invalid token" });
      }
      return res
        .status(401)
        .send({ success: false, message: "Internal server error" });
    }
  } else {
    return res.status(401).send({ success: false, message: "Unauthorized" });
  }
};

exports.authRole = (role) => {
    return (req, res, next) => {
        if (req.user.role !== role) {
        return res
            .status(401)
            .send({ success: false, message: "Unauthorized" });
        }
        next();
    };
}

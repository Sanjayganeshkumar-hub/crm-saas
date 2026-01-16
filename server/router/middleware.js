const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

module.exports = function auth(req, res, next) {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ msg: "No token, access denied" });
  }

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Invalid token" });
  }
};

const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ msg: "No token provided" });
  }

  const token = authHeader.split(" ")[1]; // Bearer <token>

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "crm_secret_123"
    );

    req.user = { userId: decoded.userId };
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Invalid token" });
  }
};

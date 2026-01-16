const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const auth = req.headers.authorization;

  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "No token" });
  }

  try {
    const token = auth.split(" ")[1];
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "secret"
    );

    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Invalid token" });
  }
};

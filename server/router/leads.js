const express = require("express");
const jwt = require("jsonwebtoken");
const Lead = require("../models/lead");

const router = express.Router();

// AUTH MIDDLEWARE
function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ msg: "No token" });

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ msg: "Invalid token" });
  }
}

// Get user leads
router.get("/", auth, async (req, res) => {
  const leads = await Lead.find({ userId: req.user.userId });
  res.json(leads);
});

// Add lead
router.post("/", auth, async (req, res) => {
  const lead = await Lead.create({
    ...req.body,
    userId: req.user.userId,
  });
  res.json(lead);
});

// Update stage
router.put("/:id", auth, async (req, res) => {
  await Lead.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.userId },
    { stage: req.body.stage }
  );
  res.json({ msg: "Updated" });
});

// Delete
router.delete("/:id", auth, async (req, res) => {
  await Lead.findOneAndDelete({
    _id: req.params.id,
    userId: req.user.userId,
  });
  res.json({ msg: "Deleted" });
});

module.exports = router;

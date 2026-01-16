const express = require("express");
const router = express.Router();
const Lead = require("../models/lead");
const jwt = require("jsonwebtoken");

/* AUTH MIDDLEWARE */
function auth(req, res, next) {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ msg: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ msg: "Invalid token" });
  }
}

/* GET ONLY LOGGED-IN USER LEADS */
router.get("/", auth, async (req, res) => {
  const leads = await Lead.find({ userId: req.user.id });
  res.json(leads);
});

/* CREATE LEAD FOR LOGGED-IN USER */
router.post("/", auth, async (req, res) => {
  const lead = new Lead({
    ...req.body,
    userId: req.user.id
  });
  await lead.save();
  res.json(lead);
});

/* UPDATE LEAD (ONLY OWNER) */
router.put("/:id", auth, async (req, res) => {
  await Lead.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    req.body
  );
  res.json({ success: true });
});

/* DELETE LEAD (ONLY OWNER) */
router.delete("/:id", auth, async (req, res) => {
  await Lead.findOneAndDelete({
    _id: req.params.id,
    userId: req.user.id
  });
  res.json({ success: true });
});

module.exports = router;
